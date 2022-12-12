using System;
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
        var url = "http://127.0.0.1:5500/index.html";
#endif
#if RELEASE
        var url = "http://127.0.0.1:9000/index.html";
#endif

        _driver.Navigate().GoToUrl(url);
    }

    [ClassCleanup]
    public static void TearDown() {
        _driver?.Dispose();
    }

    [TestMethod]
    public void Test5GetLoginModal() {
        _driver?.SwitchTo().ActiveElement();
        var loginButton = _driver?.FindElement(By.XPath("//*[@id=\"login\"]"));

        Assert.IsNotNull(loginButton);

        loginButton?.Click();
    }

    //[TestMethod]
    //public void Test1GetLogo() {
    //    _driver?.SwitchTo().ActiveElement();
    //    var sort = _driver?.FindElement(By.ClassName("logo"));

    //    Assert.IsNotNull(sort);

    //    sort?.Click();
    //}

    //[TestMethod]
    //public void Test2ChangeTheme() {
    //    _driver?.SwitchTo().ActiveElement();
    //    var theme = _driver?.FindElement(By.Id("theme-button"));

    //    Assert.IsNotNull(theme);

    //    theme?.Click();
    //    theme?.Click();
    //}

    //[TestMethod]
    //public void Test3AGetStorageGroup() {
    //    _driver?.SwitchTo().ActiveElement();
    //    var group = _driver?.FindElement(By.XPath("//*[@id=\"itemGrid\"]/div/div[6]/div/table/tbody/tr[1]/td[1]/div"));

    //    Assert.IsNotNull(group);

    //    group?.Click();
    //}

    //[TestMethod]
    //public void Test3BGetSort() {
    //    _driver?.SwitchTo().ActiveElement();
    //    var sort = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Column Amount')]"));

    //    Assert.IsNotNull(sort);

    //    sort?.Click();
    //}

    //[TestMethod]
    //public void Test4GetSearch() {
    //    _driver?.SwitchTo().ActiveElement();
    //    var search = _driver?.FindElement(By.ClassName("dx-texteditor-input"));

    //    Assert.IsNotNull(search);

    //    search?.SendKeys("appelsiner2");

    //    var clearInput = _driver?.FindElement(By.ClassName("dx-icon-clear"));

    //    Assert.IsNotNull(clearInput);

    //    clearInput?.Click();
    //}

    //[TestMethod]
    //public void Test6GetAccountPage() {
    //    _driver?.SwitchTo().ActiveElement();
    //    var loginButton = _driver?.FindElement(By.XPath("//*[contains(@aria-label, 'Create Account')]"));

    //    Assert.IsNotNull(loginButton);

    //    loginButton?.Click();
    //}
}
