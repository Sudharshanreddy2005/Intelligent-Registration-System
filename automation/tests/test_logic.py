from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time, os

# Paths
DRIVER_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "drivers", "chromedriver.exe")
)

HTML_URL = "file://" + os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "index.html")
)

# Chrome Options
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

    # Wait for country dropdown load
    wait.until(EC.presence_of_element_located((By.ID, "country")))
    wait.until(lambda d: len(d.find_element(By.ID, "country")
                             .find_elements(By.TAG_NAME, "option")) > 1)

    # Select "United States" (index = 1)
    country = driver.find_element(By.ID, "country")
    country.find_elements(By.TAG_NAME, "option")[1].click()

    # Wait states to load
    wait.until(lambda d: len(d.find_element(By.ID, "state")
                             .find_elements(By.TAG_NAME, "option")) > 1)

    # Print states
    state_options = driver.find_element(By.ID, "state").find_elements(By.TAG_NAME, "option")
    print("States:", [o.text for o in state_options])

    # Password mismatch
    driver.find_element(By.ID, "password").send_keys("TestPass123!")
    driver.find_element(By.ID, "confirmPassword").send_keys("Mismatch123")

    # Wait for error
    wait.until(lambda d: d.find_element(By.ID, "err-confirmPassword")
               .get_attribute("innerText").strip() != "")

    confirm_error = driver.find_element(By.ID, "err-confirmPassword").get_attribute("innerText").strip()
    print("Confirm password error:", confirm_error)

    # Submit should be disabled
    submit_btn = driver.find_element(By.ID, "submitBtn")
    print("Submit enabled?", submit_btn.is_enabled())

finally:
    time.sleep(1)
    driver.quit()
