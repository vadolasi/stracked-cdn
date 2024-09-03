(function () {
  // Function to get query parameter from the script's URL
  function getQueryParam(param) {
    const scripts = document.getElementsByTagName("script");
    const script = scripts[scripts.length - 1]; // This script is the last loaded script
    const queryString = script.src.split("?")[1] || "";
    const params = new URLSearchParams(queryString);
    return params.get(param);
  }

  const strackedId = getQueryParam("stracked");

  if (!strackedId) {
    console.error("UUID is not provided");
    return;
  }

  const apiUrl = "https://stracked-front.vercel.app/api/check-ab-test"; // Endpoint da API para verificar o UUID

  async function checkForABTests(apiUrl, strackedId) {
    try {
      const response = await fetch(`${apiUrl}?id=${strackedId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      console.log(data);
      return data ? data : null;
    } catch (error) {
      console.error("Error checking for AB tests:", error);
      return null;
    }
  }

  function runABTests(tests) {
    const currentUrl = new URL(window.location.href); // Usar URL para facilitar a manipulação de parâmetros
    const searchParams = currentUrl.search; // Obter os parâmetros da URL atual
    
    tests.forEach((test) => {
      if (currentUrl.href.startsWith(test.entryUrl)) { // Usar startsWith para maior flexibilidade
        const randomIndex = Math.floor(Math.random() * test.variants.length);
        let targetUrl = new URL(test.variants[randomIndex]); // Criar URL para manipular
        targetUrl.search = searchParams; // Atribuir os parâmetros da URL atual à URL de destino
        
        window.location.href = targetUrl.href; // Redirecionar para a URL de destino com parâmetros
      }
    });
  }
  

  (async function initABTests() {
    const tests = await checkForABTests(apiUrl, strackedId);
    if (tests) {
      runABTests(tests);
    }
  })();

  // Função para logar os eventos
  function logEvent(event) {
    console.log({
      type: event.type,
      timestamp: event.timeStamp,
      target: event.target.tagName,
      details: {
        x: event.clientX,
        y: event.clientY,
        key: event.key,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      },
    });
  }

  // Lista de eventos a serem monitorados
  const eventsToTrack = [
    "click",
    "dblclick",
    "mousedown",
    "mouseup",
    "mousemove",
    "mouseover",
    "mouseout",
    "scroll",
    "wheel",
    "submit",
    "touchstart",
    "touchmove",
    "touchend",
  ];

  // Adicionando listener para cada evento
  eventsToTrack.forEach((eventType) => {
    document.addEventListener(eventType, logEvent, false);
  });

  // Log inicial
  console.log(
    "Tracking script initialized. Monitoring events:",
    eventsToTrack.join(", ")
  );
})();
