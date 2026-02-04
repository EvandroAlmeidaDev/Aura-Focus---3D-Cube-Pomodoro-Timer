# Setup Guide - Aura Focus 3.0

## Pré-requisitos

### 1. Instalar Rust

Tauri requer o Rust instalado no sistema.

**Windows:**
1. Baixe e execute: https://rustup.rs/
2. Ou execute no PowerShell:
```powershell
winget install Rustlang.Rustup
```
3. Após instalar, **reinicie o terminal**
4. Verifique: `cargo --version`

### 2. Instalar Node.js (já instalado ✓)

Versão 18+ necessária.

### 3. Instalar Python (já instalado ✓)

Versão 3.10+ necessária.

---

## Instalação das Dependências

### Node.js (✓ Concluído)
```bash
cd g:\aura-focus-tauri
npm install
```

### Python venv (✓ Concluído)
```bash
cd python-backend
python -m venv venv
.\venv\Scripts\pip.exe install -r requirements.txt
```

---

## Executar o App

### Desenvolvimento
```bash
cd g:\aura-focus-tauri
npm run tauri dev
```

### Build para produção
```bash
npm run tauri build
```

O executável estará em: `src-tauri/target/release/aura-focus.exe`

---

## Troubleshooting

### "cargo metadata" error
- **Causa:** Rust não instalado
- **Solução:** Instale o Rust via https://rustup.rs/
- **Importante:** Reinicie o terminal após instalar

### Python modules not found
- **Causa:** venv não ativado
- **Solução:** Use `.\venv\Scripts\python.exe` para executar scripts Python

### Window doesn't appear
- **Causa:** Tauri ainda compilando (primeira vez demora 5-10 min)
- **Solução:** Aguarde a compilação terminar

---

## Estrutura do Projeto

```
aura-focus-tauri/
├── src/                # React frontend
├── src-tauri/          # Rust/Tauri backend
├── python-backend/     # Python logic
│   └── venv/          # Python virtual environment
├── public/            # Static assets
└── dist/              # Build output
```

---

## Next Steps

1. **Instale o Rust:** https://rustup.rs/
2. **Reinicie o terminal**
3. Execute: `npm run tauri dev`

A primeira compilação do Rust pode demorar 5-10 minutos. Depois disso, será muito mais rápido (hot reload).
