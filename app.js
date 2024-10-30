require("dotenv").config();
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { handlerOpenAI } = require('./openai.service')
const { init } = require("bot-ws-plugin-openai");
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const employeesAddonConfig = {
    model: "gpt-3.5-turbo",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
  };
const employeesAddon = init(employeesAddonConfig);

const flowSaludo = addKeyword("Hola")
.addAnswer(['Bienvenido a Empanadas Mingo, ¿En qué puedo ayudarte? 🥟'])
    
const flowNoDisponible = addKeyword("No entiendo")
    .addAnswer(['Lo siento, no entiendo tu pregunta. ¿En qué puedo ayudarte?'])

const flowPrincipal = addKeyword(EVENTS.WELCOME).addAction(
    async (ctx, ctxFn) => {
         console.log("ctx", ctx);
         console.log("ctxFn", ctxFn);
         
          const text = await handlerOpenAI(ctx);
      
          const empleado = await employeesAddon.determine(text); 
      
          employeesAddon.gotoFlow(empleado, ctxFn);
      
        }
      );



const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowSaludo, flowNoDisponible])
    const adapterProvider = createProvider(BaileysProvider)

    /**
   * 🤔 Empledos digitales
   * Imaginar cada empleado descrito con sus deberes de manera explicita
   */
  const employees = [
    {
      name: "SALUDO",
      description:
      "Soy Roberto. Cuando me preguntan como estoy o que tal estoy respondo de forma breve",
      flow: flowSaludo,
    },
    {
      name: "EMPLEADO_NO_DISPONIBLE",
      description:
      "Soy el mensaje que aparezco cuando no entiendo la consulta",
      flow: flowNoDisponible,
    },
    {
      name: "ERROR_DETERMINANDO_EMPELADO",
      description:
      "Soy el mensaje que aparezco cuando no entiendo la consulta",
      flow: flowNoDisponible,
    }
  ];

  employeesAddon.employees(employees);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
