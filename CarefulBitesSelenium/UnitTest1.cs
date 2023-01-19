using System;
using System.ComponentModel;
using System.Threading;
using Microsoft.VisualStudio.TestPlatform.PlatformAbstractions.Interfaces;
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
    
    var options = new ChromeOptions();


    

#if RELEASE
    options.AddArgument("--window-size=1920,1080");
    options.AddArgument("--start-maximized");
    options.AddArgument("--headless");
#endif

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
    public void Test1ARandomRecipes()
    {

        Thread.Sleep(1000);
        _driver?.SwitchTo().ActiveElement();

        var popup = _driver?.FindElement(By.XPath("//*[@id='randomCards']//*[@role='button']"));
        Assert.IsNotNull(popup);
        Thread.Sleep(100);
        popup?.Click();

        var closePopup = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Close')]"));
        Assert.IsNotNull(closePopup);
        Thread.Sleep(250);
        closePopup?.Click();
        Thread.Sleep(1000);
    }

    [TestMethod]
    public void Test1GetLoginModal() {
        _driver?.SwitchTo().ActiveElement();
        var loginButton = _driver?.FindElement(By.Id("LOGIN-BUTTON"));

        Assert.IsNotNull(loginButton);

        loginButton?.Click();
    }

    [TestMethod]
    public void Test2Login()
    {
        _driver?.SwitchTo().ActiveElement();
        var login = _driver?.FindElement(By.XPath("//*[contains(@name,'username')]"));

        Assert.IsNotNull(login);

        login?.SendKeys("Selenium");

        var loginPassword = _driver?.FindElement(By.XPath("//*[contains(@name,'password')]"));

        Assert.IsNotNull(login);

        loginPassword?.SendKeys("Selenium1234");

        Thread.Sleep(100);

        var loginButton = _driver?.FindElement(By.Id("POPUP-LOGIN-BUTTON"));

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
    public void Test4AGetStorageGroup()
    {
        _driver?.SwitchTo().ActiveElement();
        var group = _driver?.FindElement(By.XPath("//*[contains(@role,'gridcell')]"));

        Assert.IsNotNull(group);

        group?.Click();
    }

    [TestMethod]
    public void Test4BGetSort()
    {
        _driver?.SwitchTo().ActiveElement();
        var sort = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Column Amount')]"));

        Assert.IsNotNull(sort);

        sort?.Click();
    }

    [TestMethod]
    public void Test4CGetSearch()
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
    public void Test5AClickDropdown()
    {
        _driver?.SwitchTo().ActiveElement();
        var dropDown = _driver?.FindElement(By.Id("user-drop-down-button"));

        Assert.IsNotNull(dropDown);

        dropDown?.Click();
    }

    [TestMethod]
    public void Test5BchangeTheme()
    {
        _driver?.SwitchTo().ActiveElement();
        var theme = _driver?.FindElement(By.XPath("//*[contains(@class,'dx-icon-tips')]"));

        Assert.IsNotNull(theme);

        theme?.Click();
    }

    [TestMethod]
    public void Test5GetItemStorage()
    {
        _driver?.SwitchTo().ActiveElement();
        var group = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Storage Management')]"));
        Assert.IsNotNull(group);

        group?.Click(); 

        var input = _driver?.FindElement(By.XPath("//*[contains(@name,'name')]"));
        input.SendKeys("Selenium");

        var create = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Create')]"));
        create.Click();
    }

    [TestMethod]
    public void Test6DeleteItemStorage()
    {
        _driver?.SwitchTo().ActiveElement();
        var group = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Storage Management')]"));
        Assert.IsNotNull(group);

        group?.Click();

        var dropDown = _driver?.FindElement(By.XPath("//*[contains(@id,'ITEMSTORAGE-FORM-ID')]//*[contains(@class,'dx-lookup-field')]"));
        dropDown.Click();
        dropDown.Click();

        var itemStorage = _driver?.FindElement(By.XPath("//div[@class='dx-scrollview-content']//div[@class='dx-item dx-list-item']//*[contains(text(), 'Selenium')]"));
        itemStorage.Click();

        var delete = _driver?.FindElement(By.XPath("//*[contains(@id,'ITEMSTORAGE-FORM-ID')]//*[contains(@aria-label,'Delete')]"));
        delete.Click();

        var yesButton = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Yes')]"));
        Thread.Sleep(400);
        yesButton?.Click();

        Thread.Sleep(1000);
    }

    [TestMethod]
    public void Test7AddItem()
    {
        var addItemButton = _driver?.FindElement(By.Id("add-item-button"));
        Assert.IsNotNull(addItemButton);
        addItemButton?.Click();

        var addItemButton2 = _driver?.FindElement(By.XPath("//*[@aria-label='+ Add Item']//*[contains(text(), '+ Add Item')]"));
        addItemButton2.Click();
        addItemButton2.Click();

        var inputName = _driver?.FindElement(By.XPath("//*[@class='dx-form-group-content']//div[@id='itemName']//*[@role='textbox']"));
        inputName.SendKeys("Garlic");

        var inputAmountTextbox = _driver?.FindElement(By.XPath("//*[@class='dx-form-group-content']//div[@id='amount']//input[@type='text']"));
        inputAmountTextbox.SendKeys("1");

        var selectUnit = _driver?.FindElement(By.XPath("//*[@class='dx-form-group-content']//div[@id='unit']//input[@role='combobox']"));
        selectUnit.Click();
        var selectedUnit = selectUnit.FindElement(By.XPath("//div[@class='dx-item dx-list-item']//*[contains(text(), 'kg')]"));
        selectedUnit.Click();

        var selectStorage = _driver?.FindElement(By.XPath("//*[@class='dx-form-group-content']//div[@id='addItemStorage']//input[@role='combobox']"));
        selectStorage.Click();
        var selectedStorage = selectStorage.FindElement(By.XPath("//div[@class='dx-item dx-list-item']//*[contains(text(), 'Fridge')]"));
        selectedStorage.Click();

        var scroll = _driver?.FindElement(By.XPath("//*[contains(text(), 'Save')]"));
        (_driver as IJavaScriptExecutor)?.ExecuteScript("arguments[0].scrollIntoView(true);", scroll);

        Thread.Sleep(500);

        var saveItemButton = _driver.FindElement(By.XPath("//div[@role='button']//span[contains(text(), 'Save')]"));
        saveItemButton.Click();
    }

    [TestMethod]
    public void Test7BUpdateItem()
    {
        Thread.Sleep(500);
        var updateButton = _driver?.FindElement(By.XPath("//*[contains(@aria-rowindex, '5')]//*[contains(@aria-label, 'Edit')]"));
        Assert.IsNotNull(updateButton);
        updateButton.Click();

        var inputAmountTextbox = _driver?.FindElement(By.XPath("//*[@class='dx-form-group-content']//div[@id='amount']//input[@type='text']"));
        inputAmountTextbox.Clear();
        inputAmountTextbox.SendKeys("2");

        var scroll = _driver?.FindElement(By.XPath("//*[contains(text(), 'Save')]"));
        (_driver as IJavaScriptExecutor)?.ExecuteScript("arguments[0].scrollIntoView(true);", scroll);

        Thread.Sleep(500);

        var saveItemButton = _driver.FindElement(By.XPath("//div[@role='button']//span[contains(text(), 'Save')]"));
        saveItemButton.Click();

        Thread.Sleep(500);
    }

    [TestMethod]
    public void Test7CDeleteItem()
    {
        var updateButton = _driver?.FindElement(By.XPath("//*[contains(@aria-rowindex, '5')]//*[contains(@aria-label, 'Delete')]"));
        Assert.IsNotNull(updateButton);
        updateButton.Click();

        var yesButton = _driver?.FindElement(By.XPath("//*[contains(@aria-label, 'Yes')]"));
        Assert.IsNotNull(yesButton);
        yesButton.Click();
        yesButton.Click();
    }


    [TestMethod]
    public void Test7GetRecipes()
    {
        _driver?.SwitchTo().ActiveElement();
        var foodTab = _driver?.FindElement(By.XPath("//*[contains(@class,'dx-icon-food')]"));
        foodTab?.Click();

        var filter = _driver?.FindElement(By.Id("ingredientSelection")); 
        (_driver as IJavaScriptExecutor)?.ExecuteScript("arguments[0].scrollIntoView(true);", filter);
        Thread.Sleep(10);

        var recipes = _driver?.FindElement(By.Id("ingredientSelectionBox"));
        
        Assert.IsNotNull(recipes);
        
        recipes?.Click();

        var selectedIngredient = _driver?.FindElement(By.XPath("//div[@class='dx-item dx-list-item']//*[contains(text(), 'Milk')]"));

        Assert.IsNotNull(selectedIngredient); 

        selectedIngredient?.Click();
    }

    [TestMethod]
    public void Test8GetCards()
    {
        _driver?.SwitchTo().ActiveElement();
        var cards = _driver?.FindElement(By.Id("cards"));
        (_driver as IJavaScriptExecutor)?.ExecuteScript("arguments[0].scrollIntoView(true);", cards);

        var popup = _driver?.FindElement(By.XPath("//ul[@id='cards']//div[@role='button']"));

        Assert.IsNotNull(popup);

        Thread.Sleep(100);

        popup?.Click();

        Thread.Sleep(1000);
    }

    [TestMethod]
    public void TestALogOut()
    {
        _driver?.SwitchTo().ActiveElement();

        var closePopup = _driver?.FindElement(By.XPath("//*[contains(@aria-label,'Close')]"));

        Assert.IsNotNull(closePopup);

        Thread.Sleep(250);

        closePopup?.Click();

        _driver?.SwitchTo().ActiveElement();

        var dropDown = _driver?.FindElement(By.Id("user-drop-down-button"));

        Assert.IsNotNull(dropDown);

        dropDown?.Click();
        
        var logOut = _driver?.FindElement(By.XPath("//*[contains(@class,'dx-icon-runner')]"));

        Assert.IsNotNull(logOut);

        logOut?.Click();
    }

    [TestMethod]
    public void TestBGetAccountPage() {
        _driver?.SwitchTo().ActiveElement();
        
        var loginButton = _driver?.FindElement(By.XPath("//*[@id=\"LOGIN-BUTTON\"]"));

        Assert.IsNotNull(loginButton);

        loginButton?.Click();

        _driver?.SwitchTo().ActiveElement();

        var createAccount = _driver?.FindElement(By.XPath("//*[contains(@aria-label, 'Create Account')]"));

        Assert.IsNotNull(createAccount);

        createAccount?.Click();
    }
}
