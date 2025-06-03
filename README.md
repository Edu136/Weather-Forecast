# 🌤️ Previsão do Tempo — React + Vite + Tailwind

Este é um website responsivo de **Previsão do Tempo**, desenvolvido com **React** e **Vite**, que consome a **API da OpenWeatherMap** para exibir informações meteorológicas **em tempo real** e **previsões futuras** de maneira simples, rápida e elegante.

![Screenshot do app](./caminho/para/screenshot.png)

## 🛠️ Tecnologias Utilizadas

- ⚛️ **React** — Criação de componentes interativos.
- ⚡ **Vite** — Ferramenta moderna de build e desenvolvimento.
- 🎨 **Tailwind CSS** — Estilização responsiva e utilitária.
- 🧑‍💻 **TypeScript** — Tipagem estática para maior segurança.
- 🌐 **Fetch API** — Requisições HTTP nativas para consumir dados.
- 🗺️ **Geolocation API** — Para detectar a localização atual do usuário.
- 🌙 **Modo Claro/Escuro** — Alternância dinâmica de temas.
- ✅ **ESLint + Prettier** — Padronização de código.

## ☁️ Funcionalidades

✅ Busca de clima por **nome de cidade**.  
✅ Obtenção automática do **clima pela localização atual**.  
✅ Exibição de dados meteorológicos:  
- Temperatura atual  
- Sensação térmica  
- Umidade  
- Velocidade do vento  
- Visibilidade  

✅ **Previsão para os próximos 5 dias**, com ícones e descrição.  
✅ **Modo claro e escuro** com alternância.  
✅ Layout **totalmente responsivo**.

## 🔗 API Utilizada

- **OpenWeatherMap** — https://openweathermap.org/api  
Endpoints utilizados:
- `/weather` — para informações em tempo real.
- `/forecast` — para previsões futuras.

## 📂 Estrutura do Projeto

src/
├── components/        → Componentes reutilizáveis
├── hooks/             → Custom Hooks
|   └── ui/
│   └── ForecastCard.tsx
│   └── WeatherCard.tsx
│   └── WeatherIlustration.tsx
├── lib/
│   └── utils.ts       → Funções auxiliares
├── pages/
│   ├── Index.tsx      → Página principal
│   └── NotFound.tsx   → Página de erro
├── App.tsx            → Componente raiz
├── main.tsx           → Ponto de entrada
├── App.css            → Estilos globais

Outros arquivos importantes:

- `vite.config.ts` — Configuração do Vite  
- `tailwind.config.ts` — Configuração do Tailwind CSS  
- `.env` — Armazena chave da API
"# Weather-Forecast" 
