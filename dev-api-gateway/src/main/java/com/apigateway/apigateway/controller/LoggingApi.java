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
import com.apigateway.apigateway.model.PlottingModel;
import com.apigateway.apigateway.model.UserLogModel;
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
public class LoggingApi {
    private static Map<String, String> linkParams = new HashMap<>();
    private static Map<String, String> loggerRequest = new HashMap<>();

    @Autowired
    AuthenticationApi authentication;

    @Autowired
    BaseUrl url;

    private static String tempURL = "http://localhost:3333/registry/api/v1/user/signUp";

    @JsonDeserialize
    @PostMapping(value = "/logging")
    public Object createLink(@RequestBody UserLogModel logmodel, @RequestHeader Map<String, String> loggingHeaders) throws IOException, TimeoutException, InterruptedException {
        linkParams.put("userId", logmodel.userId);
        linkParams.put("authToken", logmodel.token);

        JSONObject linkParamsNew = new JSONObject(linkParams);
        Gson gson = new Gson();

        System.out.println("New link params " + linkParamsNew);

//        System.out.println("Auth token: " + loggingHeaders.get("authToken"));

        Map<String, Boolean> authResp = new HashMap<String, Boolean>();

//        JsonElement authenticated = (JsonElement) authentication.Authentication_Check(loggingHeaders.get("authToken"));
        JsonElement authenticated = (JsonElement) authentication.Authentication_Check(logmodel.token);
        System.out.println("received from function " + authenticated.getAsJsonObject().get("authorized"));


        if (String.valueOf(authenticated.getAsJsonObject().get("authorized")).equals("true")) {
            System.out.println("came inside if: ");
            authResp.put("authenticaton", true);

//            ObjectMapper mapper = new ObjectMapper();
//            String requestBody = mapper
//                    .writeValueAsString(linkParamsNew);

            String UserId = (String) linkParamsNew.get("userId");

            HttpClient client = HttpClient.newHttpClient();

            System.out.println("Fine belwo link");
            System.out.println(url.Logger + "/history-service/api/v1/user-history/" + UserId);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url.Logger + "/history-service/api/v1/user-history/" + UserId ))
                    .GET()
                    .build();

            HttpResponse<String> resp = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("resp is " + resp);

            String respBody = resp.body();
            JSONObject bodyJSON = new JSONObject(respBody);

            System.out.println("body json is " + bodyJSON);

            JsonElement jsonElement = gson.fromJson(bodyJSON.toString(), JsonElement.class);

            System.out.println("json elements is " + jsonElement);

            return bodyJSON.toString();

        } else if (authenticated.getAsJsonObject().get("authentication").equals("false")) {
            authResp.put("authentication", false);
            return ResponseEntity.accepted().body(authResp);
        } else {
            System.out.println("Didn't return anything");
        }

        return ResponseEntity.accepted().body(authResp);

//        return new ResponseEntity<>("Request sent successfully!", HttpStatus.CREATED);
    }
}
