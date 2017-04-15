import "babel-polyfill";
import { initialiseApp, startApp } from "./app";

const request = new XMLHttpRequest();

request.open("GET", "//proverb-api.azurewebsites.net/Startup", true);
// request.open("GET", "http://localhost:5000/Startup", true);

request.onload = () => {
  if (request.status >= 200 && request.status < 400) {
    const startUpData = JSON.parse(request.responseText);

    startApp(initialiseApp(startUpData));
  }
};

request.send();
