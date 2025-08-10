#!/usr/bin/env python3
"""
Script de teste automatizado para o sistema Dental Records
Testa todas as funcionalidades principais do sistema
"""

import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class DentalRecordsTester:
    def __init__(self, base_url="http://localhost:5173"):
        self.base_url = base_url
        self.driver = None
        self.test_results = []
    
    def setup_driver(self):
        """Configura o driver do Chrome"""
        options = webdriver.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        # options.add_argument('--headless')  # Remova para ver o navegador
        self.driver = webdriver.Chrome(options=options)
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
    
    def log_result(self, test_name, status, message=""):
        """Registra o resultado do teste"""
        result = {
            "test": test_name,
            "status": "✅ PASS" if status else "❌ FAIL",
            "message": message,
            "timestamp": time.strftime("%H:%M:%S")
        }
        self.test_results.append(result)
        print(f"{result['status']} {test_name}: {message}")
    
    def test_login_page(self):
        """Testa a página de login"""
        try:
            self.driver.get(f"{self.base_url}/login")
            time.sleep(2)
            
            # Verifica se os elementos principais existem
            email_input = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
            password_input = self.driver.find_element(By.NAME, "password")
            login_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            
            self.log_result("Login Page Load", True, "Página de login carregada com sucesso")
            return True
        except Exception as e:
            self.log_result("Login Page Load", False, str(e))
            return False
    
    def test_login_functionality(self):
        """Testa o login com credenciais de teste"""
        try:
            # Usa credenciais de teste
            email_input = self.driver.find_element(By.NAME, "email")
            password_input = self.driver.find_element(By.NAME, "password")
            
            email_input.clear()
            email_input.send_keys("test@dental.com")
            
            password_input.clear()
            password_input.send_keys("123456")
            
            login_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            login_button.click()
            
            # Espera redirecionamento para dashboard
            self.wait.until(EC.url_contains("/dashboard"))
            time.sleep(2)
            
            self.log_result("Login Functionality", True, "Login realizado com sucesso")
            return True
        except Exception as e:
            self.log_result("Login Functionality", False, str(e))
            return False
    
    def test_dashboard_navigation(self):
        """Testa a navegação no dashboard"""
        try:
            # Verifica elementos do dashboard
            dashboard_title = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Dashboard')]"))
            )
            
            # Verifica cards de estatísticas
            stat_cards = self.driver.find_elements(By.CLASS_NAME, "bg-gradient-to-r")
            
            self.log_result("Dashboard Navigation", True, f"Dashboard carregado com {len(stat_cards)} cards")
            return True
        except Exception as e:
            self.log_result("Dashboard Navigation", False, str(e))
            return False
    
    def test_patient_registration(self):
        """Testa o cadastro de pacientes"""
        try:
            # Navega para página de cadastro
            self.driver.get(f"{self.base_url}/patients/new")
            time.sleep(2)
            
            # Preenche formulário
            nome_input = self.wait.until(EC.presence_of_element_located((By.NAME, "nome_completo")))
            nome_input.send_keys("João Teste Silva")
            
            email_input = self.driver.find_element(By.NAME, "email")
            email_input.send_keys("joao@teste.com")
            
            telefone_input = self.driver.find_element(By.NAME, "telefone")
            telefone_input.send_keys("11999999999")
            
            # Salva formulário
            save_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            save_button.click()
            
            time.sleep(3)
            
            self.log_result("Patient Registration", True, "Paciente cadastrado com sucesso")
            return True
        except Exception as e:
            self.log_result("Patient Registration", False, str(e))
            return False
    
    def test_appointments_page(self):
        """Testa a página de agendamentos"""
        try:
            self.driver.get(f"{self.base_url}/appointments")
            time.sleep(3)
            
            # Verifica elementos da página
            appointments_title = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Agendamentos')]"))
            )
            
            # Verifica tabela de agendamentos
            table = self.driver.find_element(By.TAG_NAME, "table")
            
            self.log_result("Appointments Page", True, "Página de agendamentos carregada")
            return True
        except Exception as e:
            self.log_result("Appointments Page", False, str(e))
            return False
    
    def test_new_appointment(self):
        """Testa criação de novo agendamento"""
        try:
            # Clica em novo agendamento
            new_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Novo Agendamento')]"))
            )
            new_button.click()
            
            time.sleep(2)
            
            # Preenche formulário de agendamento
            date_input = self.wait.until(EC.presence_of_element_located((By.NAME, "data_consulta")))
            date_input.send_keys("2024-12-25")
            
            time_input = self.driver.find_element(By.NAME, "hora_consulta")
            time_input.send_keys("14:00")
            
            # Seleciona paciente (primeiro disponível)
            try:
                patient_select = self.driver.find_element(By.NAME, "paciente_id")
                patient_select.click()
                time.sleep(1)
                patient_select.send_keys(Keys.DOWN)
                patient_select.send_keys(Keys.ENTER)
            except:
                pass
            
            # Salva agendamento
            save_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            save_button.click()
            
            time.sleep(3)
            
            self.log_result("New Appointment", True, "Agendamento criado com sucesso")
            return True
        except Exception as e:
            self.log_result("New Appointment", False, str(e))
            return False
    
    def test_reports_page(self):
        """Testa a página de relatórios"""
        try:
            self.driver.get(f"{self.base_url}/reports")
            time.sleep(3)
            
            # Verifica elementos da página
            reports_title = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Relatórios')]"))
            )
            
            self.log_result("Reports Page", True, "Página de relatórios carregada")
            return True
        except Exception as e:
            self.log_result("Reports Page", False, str(e))
            return False
    
    def test_user_management(self):
        """Testa a gestão de usuários"""
        try:
            self.driver.get(f"{self.base_url}/users")
            time.sleep(3)
            
            # Verifica elementos da página
            users_title = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Usuários')]"))
            )
            
            self.log_result("User Management", True, "Página de usuários carregada")
            return True
        except Exception as e:
            self.log_result("User Management", False, str(e))
            return False
    
    def test_logout(self):
        """Testa o logout"""
        try:
            # Procura botão de logout
            logout_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Sair')]"))
            )
            logout_button.click()
            
            time.sleep(2)
            
            # Verifica se voltou para login
            self.wait.until(EC.url_contains("/login"))
            
            self.log_result("Logout", True, "Logout realizado com sucesso")
            return True
        except Exception as e:
            self.log_result("Logout", False, str(e))
            return False
    
    def run_all_tests(self):
        """Executa todos os testes"""
        print("🦷 Iniciando testes do sistema Dental Records...")
        print("=" * 50)
        
        try:
            self.setup_driver()
            
            # Executa testes sequencialmente
            self.test_login_page()
            self.test_login_functionality()
            self.test_dashboard_navigation()
            self.test_patient_registration()
            self.test_appointments_page()
            self.test_new_appointment()
            self.test_reports_page()
            self.test_user_management()
            self.test_logout()
            
        except Exception as e:
            print(f"Erro durante execução dos testes: {e}")
        finally:
            if self.driver:
                self.driver.quit()
            
            # Imprime resumo
            print("\n" + "=" * 50)
            print("📊 RESUMO DOS TESTES")
            print("=" * 50)
            
            passed = sum(1 for r in self.test_results if "PASS" in r["status"])
            total = len(self.test_results)
            
            for result in self.test_results:
                print(f"{result['status']} {result['test']} - {result['message']}")
            
            print(f"\n✅ Testes passados: {passed}/{total}")
            
            if passed == total:
                print("🎉 Todos os testes passaram! Sistema funcionando perfeitamente.")
            else:
                print("⚠️  Alguns testes falharam. Verifique os logs acima.")
    
    def check_server_health(self):
        """Verifica se o servidor está rodando"""
        try:
            response = requests.get(self.base_url, timeout=5)
            return response.status_code == 200
        except:
            return False

if __name__ == "__main__":
    tester = DentalRecordsTester()
    
    # Verifica se o servidor está rodando
    if not tester.check_server_health():
        print("❌ Servidor não está rodando em http://localhost:5173")
        print("Por favor, execute 'npm run dev' antes de rodar os testes.")
    else:
        tester.run_all_tests()