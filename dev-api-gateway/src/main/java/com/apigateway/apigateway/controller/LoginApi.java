package com.apigateway.apigateway.controller;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;


import com.apigateway.apigateway.model.LoginModel;
import com.apigateway.apigateway.model.BaseUrl;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
public class LoginApi {
    private static Map<String, String> linkParams = new HashMap<>();

    @Autowired
    public BaseUrl url;


    @JsonDeserialize
    @PostMapping(value = "/login")
    public Object createLink(@RequestBody LoginModel loginmodel, @RequestHeader Map<String, String> plottingHeaders) throws IOException, TimeoutException, InterruptedException {
        linkParams.put("email", loginmodel.email);
        linkParams.put("password", loginmodel.password);

        System.out.println("LinkParams 1: " + linkParams);

        ObjectMapper mapper = new ObjectMapper();
        String requestBody = mapper
                .writeValueAsString(linkParams);

        System.out.println("What we are sending original: " + linkParams);

        System.out.println("What we are sending: " + requestBody);

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url.Registry + "/registry/api/v1/user/login"))
                .header("Content-Type", "application/json; charset=UTF-8")
                .POST( HttpRequest.BodyPublishers.ofString( requestBody) )
                .build();

        System.out.println("request is:  " + request.getClass());

        HttpResponse<String> resp= client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("LinkParams 2 " + resp);

        String respBody = resp.body();
        JSONObject bodyJSON = new JSONObject(respBody);

        System.out.println("LinkParams 3 " + respBody);

        Gson gson = new Gson();
        JsonElement element = gson.fromJson(bodyJSON.toString(), JsonElement.class);

        System.out.println("Full signinresponse " + element);

        return element.toString();
//        return new ResponseEntity<Object>(element, HttpStatus.OK);
    }
}