using System;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
//using OpenQA.Selenium.Firefox;
//using OpenQA.Selenium.Edge;

namespace CarefulBitesSelenium;

[TestClass]
public class UnitTest1 {
#if DEBUG
    private static readonly string DriverDirectory = @"%USERPROFILE%\webDrivers";
#endif
#if RELEASE
    private static readonly string DriverDirectory = "chromedriver";
#endif

    private static IWebDriver? _driver;

    [ClassInitialize]
    public static void Setup(TestContext context) {

#if DEBUG
        _driver = new ChromeDriver(DriverDirectory);
        //_driver = new FirefoxDriver(DriverDirectory);
        //_driver = new EdgeDriver(DriverDirectory);
#endif
#if RELEASE
        _driver = new ChromeDriver(DriverDirectory);
#endif

        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);

#if DEBUG
        var url = "https://carefulbitesfrontend.azurewebsites.net/";
#endif
#if RELEASE
        var url = "http://127.0.0.1:9000/index.html";
#endif

        _driver.Navigate().GoToUrl(url);
        Thread.Sleep(3000);
    }

    [ClassCleanup]
    public static void TearDown() {
        _driver?.Dispose();
    }

    [TestMethod]
    public void Test1GetLogo() {
        _driver?.SwitchTo().ActiveElement();
        var sort = _driver?.FindElement(By.ClassName("logo"));
        sort?.Click();
        Thread.Sleep(1000);
    }

    [TestMethod]
    public void Test2ChangeTheme() {
        _driver?.SwitchTo().ActiveElement();
        var theme = _driver?.FindElement(By.Id("theme-button"));
        theme?.Click();
        Thread.Sleep(3000);
        theme?.Click();
        Thread.Sleep(3000);
    }

    [TestMethod]
    public void Test3GetSort() {
        _driver?.SwitchTo().ActiveElement();
        var sort = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Column Amount')]"));
        sort?.Click();
        Thread.Sleep(1000);
    }

    [TestMethod]
    public void Test4GetSearch() {
        _driver?.SwitchTo().ActiveElement();
        var search = _driver?.FindElement(By.ClassName("dx-texteditor-input"));
        search?.SendKeys("appelsiner2");

        Thread.Sleep(1000);

        var clearInput = _driver?.FindElement(By.ClassName("dx-icon-clear"));
        clearInput?.Click();

        Thread.Sleep(1000);
    }

    [TestMethod]
    public void Test5GetLoginModal() {
        _driver?.SwitchTo().ActiveElement();
        var loginButton = _driver?.FindElement(By.Id("popup-button"));
        loginButton?.Click();

        Thread.Sleep(1000);
    }

    [TestMethod]
    public void Test6GetAccountPage() {
        _driver?.SwitchTo().ActiveElement();
        var loginButton = _driver?.FindElement(By.XPath("//*[contains(@aria-label, 'Create Account')]"));
        loginButton?.Click();

        Thread.Sleep(2000);
    }
}
