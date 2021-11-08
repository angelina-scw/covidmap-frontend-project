import axios from "axios";
// promise網絡請求庫,在服務端使用node.=.js http模塊, 而在客戶端用XML HttpRequests
/*
axios: Promise based HTTP client for the browser and node.js
getAllCases是返回所有JSON形式的數據
-連接Map.js的setCovidPoints function
 */
export const CovidCaseService = {
    getAllCases: function() {
        return axios.get('https://corona.lmao.ninja/v2/jhucsse/counties');
    }
};