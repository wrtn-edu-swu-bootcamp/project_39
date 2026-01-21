# 데이터베이스 권한 부여 스크립트 실행
# PostgreSQL에 연결하여 권한 부여

$env:PGPASSWORD = "1234"
$sqlFile = Join-Path $PSScriptRoot "grant-permissions.sql"

Write-Host "데이터베이스 권한 부여 중..." -ForegroundColor Yellow

# psql 명령어로 SQL 파일 실행
psql -h 34.84.221.124 -p 5432 -U postgres -d group_challenge -f $sqlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "권한 부여 완료!" -ForegroundColor Green
} else {
    Write-Host "오류 발생. 수동으로 실행해야 할 수 있습니다." -ForegroundColor Red
    Write-Host ""
    Write-Host "수동 실행 방법:" -ForegroundColor Yellow
    Write-Host "1. PowerShell에서 다음 명령어 실행:" -ForegroundColor Cyan
    Write-Host "   `$env:PGPASSWORD='1234'" -ForegroundColor White
    Write-Host "   psql -h 34.84.221.124 -p 5432 -U postgres -d group_challenge" -ForegroundColor White
    Write-Host ""
    Write-Host "2. psql 프롬프트에서 다음 명령어들을 하나씩 실행:" -ForegroundColor Cyan
    Get-Content $sqlFile | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
}
