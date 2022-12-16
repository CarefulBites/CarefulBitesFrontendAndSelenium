using System;
using System.Reflection.Metadata;
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
    
    var options = new ChromeOptions();
    options.AddArgument("--start-maximized");

#if DEBUG
        _driver = new ChromeDriver(DriverDirectory, options);
        //_driver = new FirefoxDriver(DriverDirectory);
        //_driver = new EdgeDriver(DriverDirectory);
#endif
#if RELEASE
        _driver = new ChromeDriver(DriverDirectory, options);
#endif

        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);

#if DEBUG
        //var url = "https://carefulbites.azurewebsites.net/";
        var url = "http://127.0.0.1:5500/CarefulBites_Front-end/index.html";
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
        Thread.Sleep(1000);
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

    [TestMethod]
    public void Test8GetRecipes()
    {
        _driver?.SwitchTo().ActiveElement();
        var filter = _driver?.FindElement(By.Id("ingredientSelection")); 
        ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView(true);", filter);
        Thread.Sleep(2000);

        var recipes = _driver?.FindElement(By.XPath("//div[@id='ingredientSelection']//*[@class='dx-texteditor-input']"));
        
        Assert.IsNotNull(recipes);
        
        recipes?.Click();

        var selectedIngredient = _driver?.FindElement(By.XPath("//div[@class='dx-scrollview-content']//div[@class='dx-item dx-list-item']//*[contains(@class,'dx-checkbox-icon')]"));

        Assert.IsNotNull(selectedIngredient); 

        selectedIngredient?.Click();

        Thread.Sleep(2000);

    }

    [TestMethod]
    public void Test9GetCards()
    {
        _driver?.SwitchTo().ActiveElement();
        var cards = _driver?.FindElement(By.Id("cards"));
        ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView(true);", cards);
        Thread.Sleep(1000);

        var popup = _driver?.FindElement(By.XPath("//ul[@id='cards']//div[@role='button']"));

        Assert.IsNotNull(popup);

        popup?.Click();

        Thread.Sleep(1000);

    }

    //[TestMethod]
    //public void Test9GetAccountPage()
    //{
    //    _driver?.SwitchTo().ActiveElement();
    //    var loginButton = _driver?.FindElement(By.XPath("//*[contains(@aria-label, 'Create Account')]"));

    //    Assert.IsNotNull(loginButton);

    //    loginButton?.Click();
    //}

    //[TestMethod]
    //public void Test91CreateAccount()
    //{
    //    _driver?.SwitchTo().ActiveElement();
    //    var loginButton = _driver?.FindElement(By.XPath("//*[contains(@aria-label, 'Create Account')]"));

    //    Assert.IsNotNull(loginButton);

    //    loginButton?.Click();
    //}
}
