package com.apigateway.apigateway.controller;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;


import com.apigateway.apigateway.model.BaseUrl;
import com.apigateway.apigateway.model.LoginModel;
import com.apigateway.apigateway.model.PlottingModel;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
public class PlottingMerraApi {
    private static Map<String, String> linkParams = new HashMap<>();
    private static Map<String, String> loggerRequest = new HashMap<>();
    private static Map<String, String> loggerRequest1 = new HashMap<>();

    @Autowired
    AuthenticationApi authentication;

    @Autowired
    BaseUrl url;

    private static String tempURL = "http://localhost:3333/registry/api/v1/user/signUp";

    @JsonDeserialize
    @PostMapping(value = "/plottingmerra")
    public Object createLink(@RequestBody PlottingModel plotting, @RequestHeader Map<String, String> plottingHeaders) throws IOException, TimeoutException, InterruptedException {
        System.out.println("plotting received is " + plotting);
        System.out.println("header received is: " + plottingHeaders);

        linkParams.put("year", plotting.year);
        linkParams.put("month", plotting.month);
        linkParams.put("day", plotting.day);
        linkParams.put("hour", plotting.hour);
        linkParams.put("minute", plotting.minute);
        linkParams.put("second", plotting.second);
        linkParams.put("station", plotting.station);

        System.out.println("Orifinak link parmas " + linkParams);

        JSONObject linkParamsNew = new JSONObject(linkParams);
        Gson gson = new Gson();

        System.out.println("linkparams new is " + linkParamsNew);

        System.out.println("Auth token: " + plottingHeaders.get("authToken"));

        Map<String, Boolean> authResp = new HashMap<String, Boolean>();
        Map<String, String> authResp1 = new HashMap<String, String>();

//        JsonElement authenticated = (JsonElement) authentication.Authentication_Check(plottingHeaders.get("authToken"));
        JsonElement authenticated = (JsonElement) authentication.Authentication_Check(plotting.authToken);
        System.out.println("received from function " + authenticated.getAsJsonObject().get("authorized"));
        linkParams.put("userId", String.valueOf(authenticated.getAsJsonObject().get("userId")));

        System.out.println("Link params after userId put is: " + linkParams);

//        First visit to Log DB
        if (String.valueOf(authenticated.getAsJsonObject().get("authorized")).equals("true")) {
            System.out.println("came inside if: ");
            authResp.put("authenticaton", true);
            loggerRequest.put("userId", String.valueOf(authenticated.getAsJsonObject().get("userId")));
            loggerRequest.put("logType", "REQUEST");
            loggerRequest.put("URL", "NA");
            loggerRequest.put("logDetails", String.valueOf(linkParamsNew));

            System.out.println("logger reuqest  is " + loggerRequest);

            String loggerRequestNew = gson.toJson(loggerRequest);

            System.out.println("log request " + loggerRequestNew);

            ObjectMapper mapper = new ObjectMapper();
            String requestBody = mapper
                    .writeValueAsString(loggerRequest);

            System.out.println("firstlog is " + requestBody);

            HttpClient client = HttpClient.newHttpClient();

            System.out.println("Logger url is : " + url.Logger + "/history-service/api/v1/logs");

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url.Logger + "/history-service/api/v1/logs"))
                    .POST( HttpRequest.BodyPublishers.ofString( requestBody) )
                    .build();

            HttpResponse<String> resp = client.send(request, HttpResponse.BodyHandlers.ofString());

            String respBody = resp.body();
            JSONObject bodyJSON = new JSONObject(respBody);

            JsonElement jsonElement = gson.fromJson(bodyJSON.toString(), JsonElement.class);

            System.out.println("json elements is " + jsonElement);

            JsonElement firstLogResp = (jsonElement
                    .getAsJsonObject().get("response")
                    .getAsJsonObject().get("logIdentifier"));

            System.out.println("response is: " + firstLogResp);

//            Request to plotting

            String requestBodyPlotting = mapper
                    .writeValueAsString(linkParams);

            HttpRequest requestPlotting = HttpRequest.newBuilder()
                    .uri(URI.create(url.MerraPlotting + "/plottingmerra"))
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .POST( HttpRequest.BodyPublishers.ofString( requestBodyPlotting) )
                    .build();

            HttpResponse<String> respPlotting = client.send(requestPlotting, HttpResponse.BodyHandlers.ofString());

            String respBodyPlotting = respPlotting.body();
            JSONObject bodyJSONPlotting = new JSONObject(respBodyPlotting);

            JsonElement plottingElement = gson.fromJson(bodyJSONPlotting.toString(), JsonElement.class);

            System.out.println("first response from plotting: " + plottingElement);

            JsonElement plottingElementNew = (plottingElement.
                    getAsJsonObject().get("url"));

            System.out.println("response from plotting: " + plottingElementNew);

            //Sending Response to Logger

            loggerRequest1.put("userId", String.valueOf(authenticated.getAsJsonObject().get("userId")));
            loggerRequest1.put("logIdentifier", String.valueOf(firstLogResp));
            loggerRequest1.put("logType", "RESPONSE");
            loggerRequest1.put("URL", String.valueOf(plottingElementNew));
            loggerRequest1.put("logDetails", String.valueOf(linkParamsNew));

            System.out.println("logger reuqest 1 is " + loggerRequest1);

            String loggerRequest1New = gson.toJson(loggerRequest1);

            System.out.println("log request 1 " + loggerRequest1New);


            String requestBodyRespLog = mapper
                    .writeValueAsString(loggerRequest1);

            System.out.println("requestbodyResplog is " + requestBodyRespLog);

            HttpRequest requestRespLog = HttpRequest.newBuilder()
                    .uri(URI.create(url.Logger + "/history-service/api/v1/logs"))
                    .POST( HttpRequest.BodyPublishers.ofString( requestBodyRespLog) )
                    .build();

            HttpResponse<String> respRespLog = client.send(requestRespLog, HttpResponse.BodyHandlers.ofString());

            String respBodyRespLog = respRespLog.body();
            JSONObject bodyJSONRespLog = new JSONObject(respBodyRespLog);

            JsonElement finalJSONElement = gson.fromJson(bodyJSONRespLog.toString(), JsonElement.class);

            System.out.println("new response from log: " + finalJSONElement);

            return plottingElementNew.toString();

        } else if (authenticated.getAsJsonObject().get("authentication").equals("false")) {
            authResp.put("authentication", false);
            return authResp;
        } else {
            authResp1.put("authentication", "Server_Error");
            System.out.println("Didn't return anything");
        }

        return ResponseEntity.accepted().body(authResp);

    }
}
