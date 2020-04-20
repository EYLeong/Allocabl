package com.example.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;

public class SeleniumTest extends Thread {
    static WebDriver driver;
    //static EdgeOptions edgeOptions;

    // Change path
    static String PATH = "http://127.0.0.1:3000/";

    public static void main(String[] args) throws InterruptedException {
        /*
        System.setProperty("webdriver.edge.driver","E:\\Users\\Owner\\Desktop\\Tools\\selenium-java-3.141.59\\msedgedriver.exe");
        edgeOptions = new EdgeOptions();
        edgeOptions.setBinary("E:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe");
        */

        System.setProperty("webdriver.chrome.driver","C:\\Users\\tscd1\\Downloads\\chromedriver_win32_2\\chromedriver.exe");

        System.out.println("Testing Flow 1:");
        testFlow();

        System.out.println("Testing Flow 3:");
        System.out.println(testFlow3());

        System.out.println("Testing Robust:");
        System.out.println(testRobust());

        System.out.println("Testing Manual Connect Exist:");
        System.out.println(testManualExist());

        System.out.println("Testing Manual Connect Not Exist:");
        System.out.println(testManualNotExist());


        // Flood Testing (Not used)
//        Thread.sleep(1000);
//
//        for(int i=0;i <10;i++) {
//            Thread t = new Thread() {
//                public void run() {
//
//                    try {
//                        System.out.println(testFlood());
//                    } catch (IllegalArgumentException e) {
//
//                    }
//                }
//            };
//            t.start();
//        }

    }
    public static void testFlow(){
        // Sales
        try{
            //EdgeDriver driver = new EdgeDriver(edgeOptions);
            driver = new ChromeDriver();
            driver.get(PATH);
            WebElement support = driver.findElement(By.id("support_image"));
            support.click();
            Thread.sleep(1000);

            WebElement nextButton = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton.click();
            Thread.sleep(2000);
            WebElement nextButton2 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton2.click();
            Thread.sleep(2000);
            WebElement nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            nextButton3.click();
            Thread.sleep(20000);
            WebElement response = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[1]/div[1]/div/div/span"));
            System.out.println(response.getText());

            if(response.getText().equals("You are now connected!")) System.out.println("Sales: passed");
            else System.out.println("Sales: failed");

        } catch(final Exception e){
            System.out.println("Sales: failed");
        } finally{
            driver.close();
        }


        // Finance

        try {
            //EdgeDriver driver = new EdgeDriver(edgeOptions);
            driver = new ChromeDriver();
            driver.get(PATH);
            WebElement support = driver.findElement(By.id("support_image"));
            support.click();
            Thread.sleep(1000);

            WebElement nextButton = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton.click();
            Thread.sleep(2000);
            WebElement nextButton2 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            nextButton2.click();
            Thread.sleep(2000);
            WebElement nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            nextButton3.click();
            Thread.sleep(20000);

            WebElement response = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[1]/div[1]/div/div/span"));
            System.out.println(response.getText());
            if(response.getText().equals("You are now connected!")) System.out.println("Finance: passed");
            else System.out.println("Finance: failed");

        } catch (final Exception e) {
            System.out.println("Finance: failed");
        } finally{
            driver.close();
        }


        // General
        try {
            //EdgeDriver driver = new EdgeDriver(edgeOptions);
            driver = new ChromeDriver();
            driver.get(PATH);
            WebElement support = driver.findElement(By.id("support_image"));
            support.click();
            Thread.sleep(1000);

            WebElement nextButton = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton.click();
            Thread.sleep(2000);
            WebElement nextButton2 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[3]"));
            nextButton2.click();
            Thread.sleep(2000);
            WebElement nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            nextButton3.click();
            Thread.sleep(20000);

            WebElement response = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[1]/div[6]/div/div/span"));
            System.out.println(response.getText());
            if(response.getText().equals("no agent online")) System.out.println("General: passed");
            else System.out.println("General: failed");

        } catch (final Exception e) {
            System.out.println("General: failed");
        } finally{
            driver.close();
        }

    }


    public static boolean testFlow2(){
        try {
            driver.get(PATH);
            WebElement support = driver.findElement(By.id("support_image"));
            support.click();
            Thread.sleep(1000);
            WebElement nextButton = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton.click();
            Thread.sleep(2000);
            WebElement nextButton2 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton2.click();
            Thread.sleep(2000);
            WebElement nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            nextButton3.click();
            Thread.sleep(1000);
        } catch (final Exception e) {
            System.out.println("Error");
        }
        //WebDriver driver2 = new EdgeDriver(edgeOptions);
        WebDriver driver2 = new ChromeDriver();
        try {
            driver2.get(PATH);
            WebElement support = driver2.findElement(By.id("support_image"));
            support.click();
            Thread.sleep(1000);
            WebElement nextButton = driver2.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton.click();
            Thread.sleep(2000);
            WebElement nextButton2 = driver2.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton2.click();
            Thread.sleep(2000);
            WebElement nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            nextButton3.click();
            Thread.sleep(1000);
            WebElement response = driver2.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[1]/div[6]/div/div/span"));
            if(response.getText().equals("All agents busy! Added to waitlist!"))
                System.out.println("Joining Waitlist");
            else {
                System.out.println("Not Joining Waitlist, Error");
            }
            Thread.sleep(2000);
            driver.close();

            // Wait 30 seconds for a response else fail
            WebElement response2 = driver2.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[1]/div[1]/div/div/span"));
            int count = 0;
            while(!response2.getText().equals("You are now connected!")) {
//                System.out.println("Exit Waitlist, Connecting Agent");
//                return true;
                Thread.sleep(1000);
                count++;
                if(count > 30) break;
                else if (response2.getText().equals("You are now connected!")) return true;
            }
            return false;
        } catch (final Exception e) {
            System.out.println("Error");
            return false;
        }
    }

    public static boolean testFlow3() {
        try {
            driver = new ChromeDriver();
            WebDriver driver2 = new ChromeDriver();
            WebDriver driver3 = new ChromeDriver();

            /*
            driver = new EdgeDriver(edgeOptions);
            WebDriver driver2 = new EdgeDriver(edgeOptions);
            WebDriver driver3 = new EdgeDriver(edgeOptions);

             */
            
            //Web 1
            driver.get(PATH);
            WebElement web1_support = driver.findElement(By.id("support_image"));
            web1_support.click();
            Thread.sleep(1000);
            WebElement web1_nextButton = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            web1_nextButton.click();
            Thread.sleep(1000);
            WebElement web1_nextButton2 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            web1_nextButton2.click();
            Thread.sleep(2000);
            WebElement web1_nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            web1_nextButton3.click();
            Thread.sleep(2000);

            //Web 2
            driver2.get(PATH);
            WebElement web2_support = driver2.findElement(By.id("support_image"));
            web2_support.click();
            Thread.sleep(1000);
            WebElement web2_nextButton = driver2.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            web2_nextButton.click();
            Thread.sleep(1000);
            WebElement web2_nextButton2 = driver2.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            web2_nextButton2.click();
            Thread.sleep(2000);
            WebElement web2_nextButton3 = driver2.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            web2_nextButton3.click();
            Thread.sleep(2000);
            
            //Web 3
            driver3.get(PATH);
            WebElement web3_support = driver3.findElement(By.id("support_image"));
            web3_support.click();
            Thread.sleep(1000);
            WebElement web3_nextButton = driver3.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            web3_nextButton.click();
            Thread.sleep(1000);
            WebElement web3_nextButton2 = driver3.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            web3_nextButton2.click();
            Thread.sleep(2000);
            WebElement web3_nextButton3 = driver3.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            web3_nextButton3.click();

            Thread.sleep(2000);
            driver2.close();
            Thread.sleep(1000);
            driver.close();
            Thread.sleep(40000);

            int count = 0;
            while(count < 50) {
                try {
                    WebElement response3 = driver3.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[1]/div[1]/div/div/span"));
                    System.out.println(response3.getText());
                    break;
                } catch (Exception e) {
                    System.out.println("No response");
                }
                count++;
            }
            driver3.close();
            return true;
        } catch (final Exception e) {
            System.out.println("Error");
            return false;
        }
    }

    public static boolean testFlood(){
        //WebDriver webdriver = new EdgeDriver(edgeOptions);
        WebDriver webdriver = new ChromeDriver();
        try {
            webdriver.get(PATH);
            WebElement support = webdriver.findElement(By.id("support_image"));
            support.click();
            Thread.sleep(1000);
            WebElement nextButton = webdriver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton.click();
            Thread.sleep(2000);
            WebElement nextButton2 = webdriver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton2.click();
            Thread.sleep(2000);
            WebElement nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            nextButton3.click();
            Thread.sleep(1000);
        } catch (final Exception e) {
            return false;
        }
        return true;
    }

    public static boolean testRobust(){
        try {
            //EdgeDriver driver = new EdgeDriver(edgeOptions);
            driver = new ChromeDriver();
            driver.get(PATH);
            WebElement support = driver.findElement(By.id("support_image"));
            support.click();
            Thread.sleep(1000);
            WebElement nextButton = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton.click();
            Thread.sleep(2000);
            WebElement nextButton2 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton2.click();
            Thread.sleep(2000);
            WebElement nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[2]"));
            nextButton3.click();
            Thread.sleep(20000);
            try{
            for(int i=0; i < 50; i++) {
                WebElement input = driver.findElement(By.className("botui-actions-text-input"));
                WebElement form = driver.findElement(By.className("botui-actions-text"));
                input.sendKeys("hi");
                Thread.sleep(200);
                form.submit();
            }}catch(Exception e){
                System.out.println("Disconnected");
            }
            driver.close();
            return true;
        } catch (final Exception e) {
            return false;
        }
    }

    public static boolean testManualExist(){
        try {
            //EdgeDriver driver = new EdgeDriver(edgeOptions);
            driver = new ChromeDriver();
            driver.get(PATH);
            WebElement support = driver.findElement(By.id("support_image"));
            support.click();
            Thread.sleep(1000);
            WebElement nextButton = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton.click();
            Thread.sleep(2000);
            WebElement nextButton2 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton2.click();
            Thread.sleep(2000);
            WebElement nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton3.click();
            Thread.sleep(2000);
            WebElement input = driver.findElement(By.className("botui-actions-text-input"));
            WebElement form = driver.findElement(By.className("botui-actions-text"));
            input.sendKeys("sales1");
            Thread.sleep(1000);
            form.submit();

            Thread.sleep(20000);

            WebElement response = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[1]/div[1]/div/div/span"));
            System.out.println(response.getText());
            if(response.getText().equals("You are now connected!")) System.out.println("Manual Exist: passed");
            else System.out.println("Manual Exist: failed");

            driver.close();
            return true;
        } catch (final Exception e) {
            return false;
        }
    }

    public static boolean testManualNotExist(){
        try {
            //EdgeDriver driver = new EdgeDriver(edgeOptions);
            driver = new ChromeDriver();
            driver.get(PATH);
            WebElement support = driver.findElement(By.id("support_image"));
            support.click();
            Thread.sleep(1000);
            WebElement nextButton = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton.click();
            Thread.sleep(2000);
            WebElement nextButton2 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton2.click();
            Thread.sleep(2000);
            WebElement nextButton3 = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
            nextButton3.click();
            Thread.sleep(2000);
            WebElement input = driver.findElement(By.className("botui-actions-text-input"));
            WebElement form = driver.findElement(By.className("botui-actions-text"));
            input.sendKeys("financeA");
            Thread.sleep(1000);
            form.submit();

            Thread.sleep(2000);

            WebElement response = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div/div[1]/div[1]/div/div/span"));
            System.out.println(response.getText());
            if(response.getText().equals("")) System.out.println("Manual Not Exist: passed");
            else System.out.println("Manual Not Exist: failed");

            driver.close();
            return true;
        } catch (final Exception e) {
            return false;
        }
    }

    public static boolean testSupport(){
        try{
            driver.get(PATH);
            WebElement support = driver.findElement(By.id("support_image"));
            support.click();
            if(driver.findElement(By.className("botui-actions-buttons-button")).isDisplayed()){
                return true;
            }else{
                return false;
            }
        }catch(final Exception e){
            return false;
        }
    }
}


/*
    public static Boolean[] testFlood(){
        Boolean[] result = new Boolean[10];
        WebDriver[] webdrivers = new ChromeDriver[10];
        Thread[] threads = new Thread[10];

//        for(int i=0;i<10;i++) {
//            threads[i].start();
//            webdrivers[i] = new ChromeDriver();
//            webdrivers[i].get("http://35.224.229.87:3000/");
//        }

        for(int i=0;i<10;i++) {
            try {
                webdrivers[i] = new ChromeDriver();
                webdrivers[i].get(PATH);
                WebElement support = ((ChromeDriver) webdrivers[i]).findElement(By.id("support_image");
                support.click();
                Thread.sleep(1000);
                WebElement nextButton = ((ChromeDriver) webdrivers[i]).findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
                nextButton.click();
                Thread.sleep(2000);
                WebElement nextButton2 = ((ChromeDriver) webdrivers[i]).findElement(By.xpath("/html/body/div[1]/div[1]/div/div[2]/div/div/button[1]"));
                nextButton2.click();
                result[i] =  true;
                Thread.sleep(1000);
            } catch (final Exception e) {
                result[i] = false;
            }
        }
        return result;
    }
*/
