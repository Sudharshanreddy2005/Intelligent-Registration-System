from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time, os

DRIVER_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "drivers", "chromedriver.exe")
)

HTML_URL = "file://" + os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "index.html")
)

options = Options()
options.add_argument("--allow-file-access-from-files")
options.add_argument("--disable-web-security")
options.add_argument("--disable-site-isolation-trials")
options.add_argument("--allow-insecure-localhost")
options.add_argument("--disable-features=IsolateOrigins,site-per-process")

driver = webdriver.Chrome(service=Service(DRIVER_PATH), options=options)
wait = WebDriverWait(driver, 10)

try:
    driver.get(HTML_URL)

    # WAIT FOR FIRST DROPDOWN TO LOAD
    wait.until(EC.presence_of_element_located((By.ID, "country")))
    wait.until(lambda d: len(d.find_element(By.ID, "country").find_elements(By.TAG_NAME, "option")) > 1)

    # Fill fields
    driver.find_element(By.ID, "firstName").send_keys("Daksh")
    driver.find_element(By.ID, "lastName").send_keys("Sahu")
    driver.find_element(By.ID, "email").send_keys("daksh.sahu@example.com")
    driver.find_element(By.ID, "phone").send_keys("+91 9876543210")
    driver.find_element(By.CSS_SELECTOR, 'input[name="gender"][value="male"]').click()

    # Select Country
    country = driver.find_element(By.ID, "country")
    country.find_elements(By.TAG_NAME, "option")[1].click()

    # WAIT FOR STATES TO LOAD
    wait.until(lambda d: len(d.find_element(By.ID, "state").find_elements(By.TAG_NAME, "option")) > 1)

    # Select State
    state = driver.find_element(By.ID, "state")
    state.find_elements(By.TAG_NAME, "option")[1].click()

    # WAIT FOR CITIES TO LOAD
    wait.until(lambda d: len(d.find_element(By.ID, "city").find_elements(By.TAG_NAME, "option")) > 1)

    # Select City
    city = driver.find_element(By.ID, "city")
    city.find_elements(By.TAG_NAME, "option")[1].click()

    # Passwords
    driver.find_element(By.ID, "password").send_keys("StrongPassw0rd!")
    driver.find_element(By.ID, "confirmPassword").send_keys("StrongPassw0rd!")
    driver.find_element(By.ID, "terms").click()

    time.sleep(0.5)

    # Trigger JS submit
    driver.execute_script("window.triggerSubmitFromSelenium();")

    # WAIT FOR ALERT TEXT
    wait.until(lambda d: d.find_element(By.ID, "formAlert").get_attribute("innerText").strip() != "")

    alert_text = driver.find_element(By.ID, "formAlert").get_attribute("innerText").strip()

    screenshot_path = os.path.join(os.path.dirname(__file__), "success-state.png")
    driver.save_screenshot(screenshot_path)

    print("Saved success screenshot:", screenshot_path)
    print("Alert text:", alert_text)

finally:
    time.sleep(1)
    driver.quit()
