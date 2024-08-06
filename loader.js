(function () {
  const websiteUuid = window.abTestConfig && window.abTestConfig.websiteUuid;
  if (!websiteUuid) {
    console.error("UUID is not provided in the abTestConfig configuration");
    return;
  }

  const apiUrl = "http://xxxweb.ddns.net:3000/api/check-ab-tests"; // Endpoint da API para verificar o UUID

  async function checkForABTests(apiUrl, websiteUuid) {
    try {
      const response = await fetch(`${apiUrl}?id=${websiteUuid}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.hasTests ? data.tests : null;
    } catch (error) {
      console.error("Error checking for AB tests:", error);
      return null;
    }
  }

  function runABTests(tests) {
    const currentUrl = window.location.href; // Usar href para incluir o domínio completo na comparação
    tests.forEach((test) => {
      if (currentUrl === test.entryUrl) {
        const randomIndex = Math.floor(Math.random() * test.variants.length);
        const targetUrl = test.variants[randomIndex].pageUrl;
        window.location.href = targetUrl;
      }
    });
  }

  (async function initABTests() {
    const tests = await checkForABTests(apiUrl, websiteUuid);
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
