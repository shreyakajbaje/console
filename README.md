# StreamsHub Console for Apache Kafka<sup>®</sup>
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=streamshub_console&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=streamshub_console) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=streamshub_console&metric=coverage)](https://sonarcloud.io/summary/new_code?id=streamshub_console)
StreamsHub Console is a web application designed to facilitate interactions with Apache Kafka<sup>®</sup> instances, optionally leveraging the [Strimzi](https://strimzi.io) Cluster Operator for Kafka<sup>®</sup> instances running on Kubernetes.
It is composed of three main parts:
- a [REST API](./api) backend developed with Java and [Quarkus](https://quarkus.io/)
- a [user interface (UI)](./ui) built with [Next.js](https://nextjs.org/) and [PatternFly](https://patternfly.org)
- a Kubernetes [operator](./operator) developed with Java and [Quarkus](https://quarkus.io/)

## Roadmap / Goals

The future goals of this project are to provide a user interface to interact with and manage additional data streaming components such as:
- [Apicurio Registry](https://www.apicur.io/registry/) for message serialization and de-serialization + validation
- [Kroxylicious](https://kroxylicious.io/)
- [Apache Flink](https://flink.apache.org/)

Contributions and discussions around use cases for these (and other relevant) components are both welcome and encouraged.

## Deployment
There are several ways to deploy the console - via the operator using the Operator Lifecycle Manager (OLM), via the operator using plain Kubernetes resources, or directly with Kubernetes resources (without the operator).

### Prerequisites
#### Kafka
The instructions below assume an existing Apache Kafka<sup>®</sup> cluster is available to use from the console. We recommend using [Strimzi](https://strimzi.io) to create and manage your Apache Kafka<sup>®</sup> clusters - plus the console provides additional features and insights for Strimzi Apache Kafka<sup>®</sup> clusters.

If you already have Strimzi installed but would like to create an Apache Kafka<sup>®</sup> cluster for use with the console, example resources are available to get started.  This example will create an Apache Kafka<sup>®</sup> cluster in KRaft mode with SCRAM-SHA-512 authentication, a Strimzi `KafkaNodePool` resource to manage the cluster nodes, and a Strimzi `KafkaUser` resource that may be used to connect to the cluster.

Modify the `CLUSTER_DOMAIN` to match the base domain of your Kubernetes cluster (used for ingress configuration), use either `route` (OpenShift) or `ingress` (vanilla Kubernetes) for `LISTENER_TYPE`, and set `NAMESPACE` to be the namespace where the Apache Kafka<sup>®</sup> cluster will be created.
```shell
export CLUSTER_DOMAIN=apps-crc.testing
export NAMESPACE=kafka
export LISTENER_TYPE=route
cat examples/kafka/*.yaml | envsubst | kubectl apply -n ${NAMESPACE} -f -
```

#### Prometheus
Prometheus is an optional dependency of the console if cluster metrics are to be displayed. The operator currently installs a private Prometheus instance for each `Console` instance. However, when installing a single console deployment, Prometheus must be either installed separately or provided via a URL reference. This will be addressed below in the section dealing with creating a console via a `Deployment`.

### Deploy the operator with OLM
The preferred way to deploy the console is using the Operator Lifecycle Manager, or OLM. The sample install files in `install/operator-olm` will install the operator with cluster-wide scope. This means that `Console` instances may be created in any namespace. If you wish to limit the scope of the operator, the `OperatorGroup` resource may be modified to specify only the namespace that should be watched by the operator.

This example will create the operator's OLM resources in the `default` namespace. Modify the `NAMESPACE` variable according to your needs.
```shell
export NAMESPACE=default
cat install/operator-olm/*.yaml | envsubst | kubectl apply -n ${NAMESPACE} -f -
```
Once the operator is ready, you may then create a `Console` resource in the namespace where the console should be deployed. This example `Console` is based on the example Apache Kafka<sup>®</sup> cluster deployed above in the [prerequisites section](#prerequisites)
```yaml
apiVersion: console.streamshub.github.com/v1alpha1
kind: Console
metadata:
  name: example
spec:
  hostname: example-console.apps-crc.testing # Hostname where the console will be accessed via HTTPS
  kafkaClusters:
    - name: console-kafka             # Name of the `Kafka` CR representing the cluster
      namespace: kafka                # Namespace of the `Kafka` CR representing the cluster
      listener: secure                # Listener on the `Kafka` CR to connect from the console
      properties:
        values: []                    # Array of name/value for properties to be used for connections
                                      # made to this cluster
        valuesFrom: []                # Array of references to ConfigMaps or Secrets with properties
                                      # to be used for connections made to this cluster
      credentials:
        kafkaUser:
          name: console-kafka-user1   # Name of the `KafkaUser` resource used to connect to Kafka
                                      # This is optional if properties are used to configure the user
```

### Deploy the operator directly

### Installing

### Install to Kubernetes

Please refer to the [installation README](./install/README.md) file for detailed information about how to install the latest release of the console in a Kubernetes cluster.

### Run locally

Running the console locally requires the use of a remote or locally-running Kubernetes cluster that hosts the Strimzi Kafka operator
and any Apache Kafka<sup>®</sup> clusters that will be accessed from the console. To get started, you will need to provide a console configuration
file and credentials to connect to the Kubernetes cluster where Strimzi and Kafka are available.

1. Using the [console-config-example.yaml](./console-config-example.yaml) file as an example, create your own configuration
   in a file `console-config.yaml` in the repository root. The `compose.yaml` file expects this location to be used and
   and difference in name or location requires an adjustment to the compose file.

2. Install the prerequisite software into the Kubernetes cluster. This step assumes none have yet been installed.
   ```shell
   ./install/000-install-dependency-operators.sh <your namespace>
   ./install/001-deploy-prometheus.sh <your namespace> <your cluster base domain>
   ./install/002-deploy-console-kafka.sh <your namespace> <your cluster base domain>
   ```
   Note that the Prometheus instance will be available at `http://console-prometheus.<your cluster base domain>` when this step
   completes.

3. Provide the Prometheus endpoint, the API server endpoint, and the service account token that you would like to use to connect to the Kubernetes cluster. These may be placed in a `compose.env` file that will be detected when starting the console.
   ```
   CONSOLE_API_SERVICE_ACCOUNT_TOKEN=<TOKEN>
   CONSOLE_API_KUBERNETES_API_SERVER_URL=https://my-kubernetes-api.example.com:6443
   CONSOLE_METRICS_PROMETHEUS_URL=http://console-prometheus.<your cluster base domain>
   ```
   The service account token may be obtain using the `kubectl create token` command. For example, to create a service account
   named "console-server" (from [console-server.serviceaccount.yaml](./install/resources/console/console-server.serviceaccount.yaml)
   with the correct permissions and a token that expires in 1 year ([yq](https://github.com/mikefarah/yq/releases) required):
   ```shell
   export NAMESPACE=<service account namespace>
   kubectl apply -n ${NAMESPACE} -f ./install/resources/console/console-server.clusterrole.yaml
   kubectl apply -n ${NAMESPACE} -f ./install/resources/console/console-server.serviceaccount.yaml
   yq '.subjects[0].namespace = strenv(NAMESPACE)' ./install/resources/console/console-server.clusterrolebinding.yaml | kubectl apply -n ${NAMESPACE} -f -
   kubectl create token console-server -n ${NAMESPACE} --duration=$((365*24))h
   ```

4. By default, the provided configuration will use the latest console release container images. If you would like to
   build your own images with changes you've made locally, you may also set the `CONSOLE_API_IMAGE` and `CONSOLE_UI_IMAGE`
   in your `compose.env` and build them with `make container-images`

5. Start the environment with `make compose-up`.

6. When finished with the local console process, you may run `make compose-down` to clean up.

## Contributing

We welcome contributions of all forms. Please see the [CONTRIBUTING](./CONTRIBUTING.md) file for how to get started.
Join us in enhancing the capabilities of this console for Apache Kafka<sup>®</sup> on Kubernetes.

## Releasing

### Milestones
Each release requires an open milestone that includes the issues/pull requests that are part of the release. All issues in the release milestone must be closed. The name of the milestone must match the version number to be released.

### Configuration
The release action flow requires that the following secrets are configured in the repository:
* `IMAGE_REPO_HOSTNAME` - the host (optionally including a port number) of the image repository where images will be pushed
* `IMAGE_REPO_NAMESPACE` - namespace/library/user where the image will be pushed
* `IMAGE_REPO_USERNAME` - user name for authentication to server `IMAGE_REPO_HOSTNAME`
* `IMAGE_REPO_PASSWORD` - password for authentication to server `IMAGE_REPO_HOSTNAME`
These credentials will be used to push the release image to the repository configured in the `.github/workflows/release.yml` workflow.

### Performing the Release
Releases are performed by modifying the `.github/project.yml` file, setting `current-version` to the release version and `next-version` to the next SNAPSHOT. Open a pull request with the changed `project.yml` to initiate the pre-release workflows. At this phase, the project milestone will be checked and it will be verified that no issues for the release milestone are still open. Additionally, the project's integration test will be run.
Once approved and the pull request is merged, the release action will execute. This action will execute the Maven release plugin to tag the release commit, build the application artifacts, create the build image, and push the image to (currently) quay.io. If successful, the action will push the new tag to the Github repository and generate release notes listing all of the closed issues included in the milestone. Finally, the milestone will be closed.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
