package com.apigateway.apigateway.controller;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import org.springframework.web.bind.annotation.*;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@CrossOrigin(origins = "*")
@RestController
public class TestApi {

    @RequestMapping(value = "/test", method = GET)
    @ResponseBody
    public String Test() throws IOException, TimeoutException, InterruptedException {
        return "Reached";
    }

}
