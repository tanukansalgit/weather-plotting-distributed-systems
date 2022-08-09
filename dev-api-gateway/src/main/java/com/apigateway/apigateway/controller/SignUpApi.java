package com.apigateway.apigateway.controller;

import java.io.DataInput;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;


import com.apigateway.apigateway.model.BaseUrl;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.apigateway.apigateway.model.SignUp;

@CrossOrigin(origins = "*")
@RestController
public class SignUpApi {
    int responseCode;
    private static Map<String, String> linkParams = new HashMap<>();

    @Autowired
    public BaseUrl url;

    @JsonDeserialize
    @PostMapping(value = "/signUp")
    public Object createLink(@RequestBody SignUp signup) throws IOException, TimeoutException, InterruptedException {
        linkParams.put("firstName", signup.firstName);
        linkParams.put("lastName", signup.lastName);
        linkParams.put("email", signup.email);
        linkParams.put("password", signup.password);


        System.out.println("Request sent");
        System.out.println("full json" + signup);
        System.out.println("firstname:" + signup.firstName);

        URL urlc = new URL("https://www.google.com");
        HttpURLConnection huc = (HttpURLConnection) urlc.openConnection();

        responseCode = huc.getResponseCode();
//    Assert.assertEquals(HttpURLConnection.HTTP_OK, responseCode);
        System.out.println(" RESPONE CODE<===================>  " + responseCode);

        System.out.println(" REGISTRY BASE URL<===================>  " + url.Registry);


        ObjectMapper mapper = new ObjectMapper();
        String requestBody = mapper
                .writeValueAsString(linkParams);

        System.out.println("REQ BODY: "+ requestBody);

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url.Registry + "/registry/api/v1/user/signUp"))
                .header("Content-Type", "application/json; charset=UTF-8")
                .POST( HttpRequest.BodyPublishers.ofString( requestBody) )
                .build();

        HttpResponse<String> resp= client.send(request, HttpResponse.BodyHandlers.ofString());

        String respBody = resp.body();
        JSONObject bodyJSON = new JSONObject(respBody);

        Gson gson = new Gson();
        JsonElement element = gson.fromJson(bodyJSON.toString(), JsonElement.class);

        System.out.println("Full signupresponse " + element);

        return element.toString();

//        return new ResponseEntity<Object>(authResponse.toString(), HttpStatus.OK);

//        return new ResponseEntity<>("Request sent successfully!", HttpStatus.CREATED);
    }
}
