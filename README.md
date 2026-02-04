# Aura Focus - 3D Cube Pomodoro Timer

---

## English

A Pomodoro timer with an interactive 3D cube interface. Built with Electron, React, and Three.js.

![version](https://img.shields.io/badge/version-4.0.0-blue) ![Electron](https://img.shields.io/badge/Electron-28-47848F) ![React](https://img.shields.io/badge/React-18-61DAFB) ![Three.js](https://img.shields.io/badge/Three.js-R3F-black)

### Demo

![Aura Focus demo](assets/demo.gif)

### Download

[Releases](https://github.com/EvandroAlmeidaDev/Aura-Focus---3D-Cube-Pomodoro-Timer/releases) – Download **Aura Focus** for Windows (portable .zip).

### Features

- **3D Interactive Cube**: Rotate the cube to switch between timer modes
- **Four Modes**: Focus (25 min default), Short Break (5 min), Long Break (35 min), Settings
- **Progress Ring**: Circular progress indicator on each face
- **Session Tracking**: Automatic progression through work/break cycles
- **Click Timer to Play/Pause**: Click the numbers to start or pause
- **Arrow Navigation**: Buttons to rotate the cube
- **Ghost Mode**: Semi-transparent always-on-top (Alt+K)
- **Languages**: English and Portuguese

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Alt + P | Play/Pause |
| Alt + R | Reset |
| Alt + K | Ghost Mode |
| Arrows | Navigate faces |

### Settings

- Duration: focus, short break, long break
- Sessions before long break: 2–6
- Sound notifications on/off
- Language: EN / PT

### Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Electron 28 |
| Frontend | React 18 + TypeScript |
| 3D | Three.js + React Three Fiber |
| Animation | React Spring |
| State | Zustand |
| Styling | Tailwind CSS |
| Build | Vite + electron-builder |

### Development

**Prerequisites:** Node.js 18+, npm or yarn

```bash
npm install
npm run dev
```

**Build:**

```bash
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

Output is in the `release` folder.

### Colors

| Mode | Color | Hex |
|------|-------|-----|
| Focus | Red | #ef4444 |
| Short Break | Green | #22c55e |
| Long Break | Blue | #3b82f6 |
| Settings | Purple | #a855f7 |

---

## Português

Timer Pomodoro com interface de cubo 3D interativo. Desenvolvido com Electron, React e Three.js.

### Demonstração

![Demonstração Aura Focus](assets/demo.gif)

### Download

[Releases](https://github.com/EvandroAlmeidaDev/Aura-Focus---3D-Cube-Pomodoro-Timer/releases) – Baixe o **Aura Focus** para Windows (.zip portátil).

### Funcionalidades

- **Cubo 3D interativo**: Gire o cubo para alternar entre os modos
- **Quatro modos**: Foco (25 min padrão), Pausa curta (5 min), Pausa longa (35 min), Configurações
- **Anel de progresso**: Indicador circular em cada face
- **Ciclos**: Progressão automática entre foco e pausas
- **Clique no timer**: Clique nos números para iniciar ou pausar
- **Navegação**: Botões de seta para girar o cubo
- **Modo fantasma**: Janela semitransparente sempre no topo (Alt+K)
- **Idiomas**: Inglês e Português

### Atalhos de teclado

| Atalho | Ação |
|--------|------|
| Alt + P | Reproduzir/Pausar |
| Alt + R | Reiniciar |
| Alt + K | Modo fantasma |
| Setas | Navegar entre faces |

### Configurações

- Duração: foco, pausa curta, pausa longa
- Sessões até pausa longa: 2 a 6
- Notificações sonoras ligado/desligado
- Idioma: EN / PT

### Stack

| Componente | Tecnologia |
|------------|------------|
| Runtime | Electron 28 |
| Frontend | React 18 + TypeScript |
| 3D | Three.js + React Three Fiber |
| Animação | React Spring |
| Estado | Zustand |
| Estilos | Tailwind CSS |
| Build | Vite + electron-builder |

### Desenvolvimento

**Requisitos:** Node.js 18+, npm ou yarn

```bash
npm install
npm run dev
```

**Build:**

```bash
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

O executável fica na pasta `release`.

### Cores

| Modo | Cor | Hex |
|------|-----|-----|
| Foco | Vermelho | #ef4444 |
| Pausa curta | Verde | #22c55e |
| Pausa longa | Azul | #3b82f6 |
| Configurações | Roxo | #a855f7 |

---

## License

MIT License
