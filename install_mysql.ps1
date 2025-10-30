# PowerShell script to install MySQL and set up databases for Hospital Appointment System

Write-Host "=== MySQL Installation and Setup for Hospital Appointment System ===" -ForegroundColor Green

# Check if MySQL is already installed
if (Get-Command mysql -ErrorAction SilentlyContinue) {
    Write-Host "MySQL is already installed!" -ForegroundColor Yellow
    mysql --version
} else {
    Write-Host "MySQL is not installed. Please install MySQL first:" -ForegroundColor Red
    Write-Host "1. Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Cyan
    Write-Host "2. During installation, set root password and remember it" -ForegroundColor Cyan
    Write-Host "3. Add MySQL to PATH environment variable" -ForegroundColor Cyan
    Write-Host "4. Restart PowerShell after installation" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Alternative: Use XAMPP or WAMP which includes MySQL" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter after installing MySQL"
}

# Check if MySQL is now available
if (Get-Command mysql -ErrorAction SilentlyContinue) {
    Write-Host "MySQL found! Setting up databases..." -ForegroundColor Green
    
    # Ask for MySQL root password
    $rootPassword = Read-Host "Enter MySQL root password" -AsSecureString
    $rootPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPassword))
    
    # Run the setup script
    Write-Host "Creating databases and user..." -ForegroundColor Yellow
    Get-Content setup_mysql.sql | mysql -u root -p$rootPasswordPlain
    
    Write-Host "Database setup completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now start the Spring Boot services:" -ForegroundColor Cyan
    Write-Host "1. cd doctor-service && mvn spring-boot:run" -ForegroundColor White
    Write-Host "2. cd patient-service && mvn spring-boot:run" -ForegroundColor White
    Write-Host "3. cd appointment-service && mvn spring-boot:run" -ForegroundColor White
    Write-Host "4. cd api-gateway && mvn spring-boot:run" -ForegroundColor White
    Write-Host ""
    Write-Host "To check data in MySQL:" -ForegroundColor Cyan
    Write-Host "mysql -u appuser -pAppPass123! -e 'USE appointment_service_db; SELECT * FROM appointments;'" -ForegroundColor White
    Write-Host "mysql -u appuser -pAppPass123! -e 'USE patient_service_db; SELECT * FROM patients;'" -ForegroundColor White
    Write-Host "mysql -u appuser -pAppPass123! -e 'USE doctor_service_db; SELECT * FROM doctors;'" -ForegroundColor White
} else {
    Write-Host "MySQL is still not available. Please install MySQL first." -ForegroundColor Red
}
