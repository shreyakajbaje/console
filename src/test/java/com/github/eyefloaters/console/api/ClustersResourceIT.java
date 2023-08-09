package com.github.eyefloaters.console.api;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.URI;
import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response.Status;

import org.eclipse.microprofile.config.Config;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.github.eyefloaters.console.kafka.systemtest.TestPlainProfile;
import com.github.eyefloaters.console.kafka.systemtest.deployment.DeploymentManager;
import com.github.eyefloaters.console.test.TestHelper;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.kubernetes.client.KubernetesServerTestResource;
import io.strimzi.api.kafka.model.Kafka;
import io.strimzi.api.kafka.model.KafkaBuilder;
import io.strimzi.api.kafka.model.listener.arraylistener.KafkaListenerType;
import io.strimzi.test.container.StrimziKafkaContainer;

import static com.github.eyefloaters.console.test.TestHelper.whenRequesting;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;

@QuarkusTest
@QuarkusTestResource(KubernetesServerTestResource.class)
@TestHTTPEndpoint(ClustersResource.class)
@TestProfile(TestPlainProfile.class)
class ClustersResourceIT {

    @Inject
    Config config;

    @Inject
    KubernetesClient client;

    @DeploymentManager.InjectDeploymentManager
    DeploymentManager deployments;

    TestHelper utils;

    StrimziKafkaContainer kafkaContainer;
    String clusterId1;
    String clusterId2;
    URI bootstrapServers;
    ServerSocket randomSocket;
    URI randomBootstrapServers;

    @BeforeEach
    void setup() throws IOException {
        kafkaContainer = deployments.getKafkaContainer();
        bootstrapServers = URI.create(kafkaContainer.getBootstrapServers());
        randomSocket = new ServerSocket(0);
        randomBootstrapServers = URI.create("dummy://localhost:" + randomSocket.getLocalPort());

        utils = new TestHelper(bootstrapServers, config, null);

        clusterId1 = utils.getClusterId();
        clusterId2 = UUID.randomUUID().toString();

        client.resources(Kafka.class).delete();
        client.resources(Kafka.class).resource(new KafkaBuilder()
                .withNewMetadata()
                    .withName("test-kafka1")
                .endMetadata()
                .withNewSpec()
                    .withNewKafka()
                        .addNewListener()
                            .withName("listener0")
                            .withType(KafkaListenerType.NODEPORT)
                            .withNewKafkaListenerAuthenticationCustomAuth()
                                .withSasl()
                            .endKafkaListenerAuthenticationCustomAuth()
                        .endListener()
                    .endKafka()
                .endSpec()
                .withNewStatus()
                    .withClusterId(clusterId1)
                    .addNewListener()
                        .withName("listener0")
                        .addNewAddress()
                            .withHost(bootstrapServers.getHost())
                            .withPort(bootstrapServers.getPort())
                        .endAddress()
                    .endListener()
                .endStatus()
                .build())
            .create();

        // Second cluster is offline/non-existent
        client.resources(Kafka.class).resource(new KafkaBuilder()
                .withNewMetadata()
                    .withName("test-kafka2")
                .endMetadata()
                .withNewSpec()
                    .withNewKafka()
                        .addNewListener()
                            .withName("listener0")
                            .withType(KafkaListenerType.NODEPORT)
                        .endListener()
                    .endKafka()
                .endSpec()
                .withNewStatus()
                    .withClusterId(clusterId2)
                    .addNewListener()
                        .withName("listener0")
                        .addNewAddress()
                            .withHost(randomBootstrapServers.getHost())
                            .withPort(randomBootstrapServers.getPort())
                        .endAddress()
                    .endListener()
                .endStatus()
                .build())
            .create();
    }

    @AfterEach
    void teardown() throws IOException {
        if (randomSocket != null) {
            randomSocket.close();
        }
    }

    @Test
    void testListClusters() {
        whenRequesting(req -> req.get())
            .assertThat()
            .statusCode(is(Status.OK.getStatusCode()))
            .body("size()", equalTo(2))
            .body("name", containsInAnyOrder("test-kafka1", "test-kafka2"))
            .body("clusterId", containsInAnyOrder(clusterId1, clusterId2))
            .body("bootstrapServers", containsInAnyOrder(
                    bootstrapServers.getHost() + ":" + bootstrapServers.getPort(),
                    randomBootstrapServers.getHost() + ":" + randomBootstrapServers.getPort()))
            .body("authType", containsInAnyOrder(equalTo("custom"), nullValue()));
    }

    @Test
    void testDescribeCluster() {
        whenRequesting(req -> req.get("{clusterId}", clusterId1))
            .assertThat()
            .statusCode(is(Status.OK.getStatusCode()))
            .body("name", equalTo("test-kafka1"))
            .body("clusterId", equalTo(clusterId1))
            .body("bootstrapServers", equalTo(bootstrapServers.getHost() + ":" + bootstrapServers.getPort()))
            .body("authType", equalTo("custom"));
    }

    @Test
    void testDescribeClusterWithKafkaUnavailable() {
        whenRequesting(req -> req.get("{clusterId}", clusterId2))
            .assertThat()
            .statusCode(is(Status.GATEWAY_TIMEOUT.getStatusCode()))
            .body("errors.size()", is(1))
            .body("errors.status", contains("504"))
            .body("errors.code", contains("5041"));
    }

    @Test
    void testDescribeClusterWithNoSuchCluster() {
        whenRequesting(req -> req.get("{clusterId}", UUID.randomUUID().toString()))
            .assertThat()
            .statusCode(is(Status.NOT_FOUND.getStatusCode()))
            .body("errors.size()", is(1))
            .body("errors.status", contains("404"))
            .body("errors.code", contains("4041"));
    }
}
