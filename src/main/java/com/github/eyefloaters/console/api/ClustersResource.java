package com.github.eyefloaters.console.api;

import java.util.concurrent.CompletionStage;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponseSchema;

import com.github.eyefloaters.console.api.model.Cluster;
import com.github.eyefloaters.console.api.service.ClusterService;

@Path("/api/clusters")
public class ClustersResource {

    @Inject
    ClusterService clusterService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponseSchema(Cluster[].class)
    @APIResponse(responseCode = "500", ref = "ServerError")
    @APIResponse(responseCode = "504", ref = "ServerTimeout")
    public Response listClusters() {
        return Response.ok(clusterService.listClusters()).build();
    }

    @GET
    @Path("{clusterId}")
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponseSchema(Cluster.class)
    @APIResponse(responseCode = "404", ref = "NotFound")
    @APIResponse(responseCode = "500", ref = "ServerError")
    @APIResponse(responseCode = "504", ref = "ServerTimeout")
    public CompletionStage<Response> describeCluster(@PathParam("clusterId") String clusterId) {
        return clusterService.describeCluster()
            .thenApply(Response::ok)
            .thenApply(Response.ResponseBuilder::build);
    }

}
