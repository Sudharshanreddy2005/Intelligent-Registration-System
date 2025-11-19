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

# Chrome options
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

    # Wait for page ready
    wait.until(EC.presence_of_element_located((By.ID, "firstName")))

    # Fill everything except LAST NAME (negative test)
    driver.find_element(By.ID, "firstName").send_keys("Daksh")
    driver.find_element(By.ID, "email").send_keys("daksh@testmail.com")
    driver.find_element(By.ID, "phone").send_keys("+91 9876543210")
    driver.find_element(By.CSS_SELECTOR, 'input[name="gender"][value="male"]').click()

    # Select country
    wait.until(lambda d: len(d.find_element(By.ID, "country")
                             .find_elements(By.TAG_NAME, "option")) > 1)
    driver.find_element(By.ID, "country").find_elements(By.TAG_NAME, "option")[1].click()

    # Select state
    wait.until(lambda d: len(d.find_element(By.ID, "state")
                             .find_elements(By.TAG_NAME, "option")) > 1)
    driver.find_element(By.ID, "state").find_elements(By.TAG_NAME, "option")[1].click()

    # Select city
    wait.until(lambda d: len(d.find_element(By.ID, "city")
                             .find_elements(By.TAG_NAME, "option")) > 1)
    driver.find_element(By.ID, "city").find_elements(By.TAG_NAME, "option")[1].click()

    # Passwords
    driver.find_element(By.ID, "password").send_keys("StrongPassw0rd!")
    driver.find_element(By.ID, "confirmPassword").send_keys("StrongPassw0rd!")
    driver.find_element(By.ID, "terms").click()

    # Trigger JS submit
    driver.execute_script("window.triggerSubmitFromSelenium();")

    # Wait for validation error
    wait.until(lambda d: d.find_element(By.ID, "err-lastName").get_attribute("innerText").strip() != "")

    # Screenshot
    screenshot_path = os.path.join(os.path.dirname(__file__), "error-state.png")
    driver.save_screenshot(screenshot_path)
    print("Saved error screenshot:", screenshot_path)

    # Read last name error
    last_name_error = driver.find_element(By.ID, "err-lastName").get_attribute("innerText").strip()
    print("Last Name Error:", last_name_error)

finally:
    time.sleep(1)
    driver.quit()
