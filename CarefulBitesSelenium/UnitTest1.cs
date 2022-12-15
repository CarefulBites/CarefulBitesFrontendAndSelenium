using System;
using System.Threading;
using System.Xml.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
//using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Interactions;
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
        var url = "https://carefulbites.azurewebsites.net/";
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
    public void Test1GetLoginModal() {
        _driver?.SwitchTo().ActiveElement();
        var loginButton = _driver?.FindElement(By.XPath("//*[@id=\"login\"]"));

        Assert.IsNotNull(loginButton);

        loginButton?.Click();
    }

    [TestMethod]
    public void Test2Login()
    {
        _driver?.SwitchTo().ActiveElement();
        var login = _driver?.FindElement(By.XPath("//*[contains(@name,'username')]"));

        Assert.IsNotNull(login);

        login?.SendKeys("Admin");

        var loginPassword = _driver?.FindElement(By.XPath("//*[contains(@name,'password')]"));

        Assert.IsNotNull(login);

        loginPassword?.SendKeys("Admin");

        var loginButton = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Log In')]"));

        Assert.IsNotNull(loginButton);

        loginButton?.Click();
    }

    [TestMethod]
    public void Test3GetLogo()
    {
        _driver?.SwitchTo().ActiveElement();
        var sort = _driver?.FindElement(By.ClassName("logo"));

        Assert.IsNotNull(sort);

        sort?.Click();
    }

    [TestMethod]
    public void Test4ChangeTheme()
    {
        _driver?.SwitchTo().ActiveElement();
        var theme = _driver?.FindElement(By.Id("theme-button"));

        Assert.IsNotNull(theme);

        theme?.Click();
        theme?.Click();
    }

    [TestMethod]
    public void Test5GetStorageGroup()
    {
        _driver?.SwitchTo().ActiveElement();
        var group = _driver?.FindElement(By.XPath("//*[@id=\"itemGrid\"]/div/div[6]/div/table/tbody/tr[1]/td[1]/div"));

        Assert.IsNotNull(group);

        group?.Click();
    }

    [TestMethod]
    public void Test6GetSort()
    {
        _driver?.SwitchTo().ActiveElement();
        var sort = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Column Amount')]"));

        Assert.IsNotNull(sort);

        sort?.Click();
    }

    [TestMethod]
    public void Test7GetSearch()
    {
        _driver?.SwitchTo().ActiveElement();
        var search = _driver?.FindElement(By.ClassName("dx-texteditor-input"));

        Assert.IsNotNull(search);

        search?.SendKeys("Milk");

        var clearInput = _driver?.FindElement(By.ClassName("dx-icon-clear"));

        Assert.IsNotNull(clearInput);

        clearInput?.Click();
    }

    //[TestMethod]
    //public void Test8GetRecipes()
    //{
    //    _driver?.SwitchTo().ActiveElement();
        
    //    Actions action = new Actions(_driver);
    //    action.DragAndDropToOffset(_driver.FindElement(By.XPath("//*[@id=\"itemGrid\"]/div/div[6]/div/table/tbody/tr[1]/td[1]/div")), 0, -250);
    //    action.Build().Perform();

    //    var filter = _driver?.FindElement(By.XPath("//*[contains(@data-dx_placeholder,'Milk')]"));
    //    Assert.IsNotNull(filter);

    //    filter?.Click();
    //}
    
    //[TestMethod]
    //public void Test8GetAccountPage() {
    //    _driver?.SwitchTo().ActiveElement();
    //    var loginButton = _driver?.FindElement(By.XPath("//*[contains(@aria-label, 'Create Account')]"));

    //    Assert.IsNotNull(loginButton);

    //    loginButton?.Click();
    //}
}
