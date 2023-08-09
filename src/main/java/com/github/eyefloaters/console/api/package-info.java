@OpenAPIDefinition(
        info = @Info(title = "", version = ""),
        components = @Components(
                responses = {
                    @APIResponse(name = "Configurations", content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = ConfigEntry.ConfigEntryMap.class))),
                    @APIResponse(name = "BadRequest",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON,
                                    schema = @Schema(implementation = ErrorResponse.class),
                                    examples = @ExampleObject(name = "Invalid query parameter", value = """
                                            {
                                              "errors": [
                                                {
                                                  "kind": "Error",
                                                  "id": "2fa1c4c0-abb1-43b9-a4d6-627e05d19ddb",
                                                  "status": "400",
                                                  "code": "4001",
                                                  "title": "Invalid query parameter",
                                                  "detail": "must be one of [ earliest, latest, maxTimestamp ] or a valid UTC ISO timestamp.",
                                                  "source": {
                                                    "parameter": "offsetSpec"
                                                  }
                                                }
                                              ]
                                            }
                                            """))),
                    @APIResponse(name = "NotAuthenticated", content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = ErrorResponse.class))),
                    @APIResponse(name = "NotAuthorized", content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = ErrorResponse.class))),
                    @APIResponse(name = "NotFound",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON,
                                    schema = @Schema(implementation = ErrorResponse.class),
                                    examples = @ExampleObject(name = "Invalid URL", value = """
                                            {
                                              "errors": [
                                                {
                                                  "kind": "Error",
                                                  "id": "2fa1c4c0-abb1-43b9-a4d6-627e05d19ddb",
                                                  "status": "404",
                                                  "code": "4041",
                                                  "title": "Resource not found",
                                                  "detail": "Unable to find matching target resource method"
                                                }
                                              ]
                                            }
                                            """))),
                    @APIResponse(name = "Conflict",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON,
                                    schema = @Schema(implementation = ErrorResponse.class))),
                    @APIResponse(name = "ServerError",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON,
                                    schema = @Schema(implementation = ErrorResponse.class),
                                    examples = @ExampleObject(name = "Internal Server Error", value = """
                                            {
                                              "errors": [
                                                {
                                                  "kind": "Error",
                                                  "id": "2fa1c4c0-abb1-43b9-a4d6-627e05d19ddb",
                                                  "status": "500",
                                                  "code": "5001",
                                                  "title": "Unexpected error",
                                                  "detail": "The server has encounted an internal error, most likely a bug"
                                                }
                                              ]
                                            }
                                            """))),
                    @APIResponse(name = "ServerTimeout",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON,
                                    schema = @Schema(implementation = ErrorResponse.class),
                                    examples = @ExampleObject(name = "Backend Service Timeout", value = """
                                            {
                                              "errors": [
                                                {
                                                  "kind": "Error",
                                                  "id": "2fa1c4c0-abb1-43b9-a4d6-627e05d19ddb",
                                                  "status": "504",
                                                  "code": "5041",
                                                  "title": "Timed out waiting for backend service",
                                                  "detail": "Response from Kafka not received before time limit reached"
                                                }
                                              ]
                                            }
                                            """))),
                }
        ))
package com.github.eyefloaters.console.api;

import jakarta.ws.rs.core.MediaType;

import org.eclipse.microprofile.openapi.annotations.Components;
import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.ExampleObject;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;

import com.github.eyefloaters.console.api.model.ConfigEntry;
import com.github.eyefloaters.console.api.model.ErrorResponse;
