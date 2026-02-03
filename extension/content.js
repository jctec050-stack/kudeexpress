// Configuración
const BASE_URL = "http://localhost:3000"; // CAMBIAR POR URL DE PRODUCCIÓN
const API_URL = `${BASE_URL}/api/invoices`;
const VISOR_URL = `${BASE_URL}`; // Ahora es la raíz

// Función para extraer datos de las tablas de e-Kuatia
// Función mejorada para extraer datos usando XPath y manejo de Inputs
// Además inyectaremos un script para interceptar la red si es necesario
function getDataByLabel(label, occurrence = 1) {
  try {
    // Busca el elemento de texto exacto o parcial
    // Usamos ( ... )[k] para elegir la ocurrencia k-ésima (por defecto la 1)
    const xpath = `(//*[contains(text(), '${label}')])[${occurrence}]`;
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const element = result.singleNodeValue;

    if (!element) return "";

    // Estrategia 1: Siguiente elemento hermano (Next Sibling)
    // Ej: <label>CDC</label> <input value="000...">
    if (element.nextElementSibling) {
      const next = element.nextElementSibling;
      // Si es un input, usamos .value, si no .textContent
      const val = next.value || next.textContent;
      if (val && val.trim()) return val.trim();
    }

    // Estrategia 2: Padre compartido (Parent Text)
    // Ej: <div><b>CDC:</b> 000...</div>
    if (element.parentElement) {
      // Caso especial: El padre contiene un input
      const inputInParent = element.parentElement.querySelector('input');
      if (inputInParent && inputInParent.value) return inputInParent.value;

      // Eliminamos el label y posibles dos puntos para ver si queda el valor
      const cleanText = element.parentElement.textContent
        .replace(label, "")
        .replace(":", "")
        .trim();
      if (cleanText.length > 1) return cleanText;
    }

    // Estrategia 3: Estructura de Tabla (TD -> TD)
    const td = element.closest('td');
    if (td && td.nextElementSibling) {
      // En tablas tambien puede haber inputs
      const inputInTd = td.nextElementSibling.querySelector('input');
      if (inputInTd) return inputInTd.value;

      return td.nextElementSibling.textContent.trim();
    }

    return "";
  } catch (e) {
    console.error("Error extrayendo " + label, e);
    return "";
  }
}

// Función auxiliar para obtener texto de una celda o input
function getCellValue(cell) {
  if (!cell) return "";
  // 1. Intentar buscar input/select/textarea
  const input = cell.querySelector('input, textarea, select');
  if (input && input.value) return input.value.trim();

  // 2. Si no, texto normal
  return cell.innerText.trim();
}

// Función para buscar TODOS los valores de un label (para listas de items sin tabla)
function getAllValuesByLabel(label) {
  const values = [];
  try {
    // XPath para buscar todos los elementos que contengan el texto
    const xpath = `//*[contains(text(), '${label}')]`;
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < result.snapshotLength; i++) {
      const element = result.snapshotItem(i);
      // Usamos la misma lógica de "hermano" o "padre" para encontrar el input
      let val = "";

      // 1. Siguiente hermano (label -> input)
      if (element.nextElementSibling) {
        val = getCellValue(element.nextElementSibling);
      }

      // 2. Padre compartido (div > label + input)
      if (!val && element.parentElement) {
        const input = element.parentElement.querySelector('input, textarea, select');
        if (input && input !== element) val = input.value;
        else if (element.parentElement.nextElementSibling) {
          // A veces el label esta en un div y el input en el div siguiente
          val = getCellValue(element.parentElement.nextElementSibling);
        }
      }

      // 3. Caso especial: Tablas (TD -> TD)
      if (!val) {
        const td = element.closest('td');
        if (td && td.nextElementSibling) val = getCellValue(td.nextElementSibling);
      }

      // Si encontramos algo, lo guardamos (incluso si es vacío, para mantener el indice)
      values.push(val || "");
    }
  } catch (e) { console.error("Error get_all " + label, e); }
  return values;
}

// Función para extraer items cuando NO es una tabla (Layout de Cards/Formularios)
function getItems() {
  const items = [];
  try {
    // Extraemos columnas completas
    const codes = getAllValuesByLabel("Código");
    // "Descripción del Producto y/o Servicio" es muy largo, probamos parte
    const descriptions = getAllValuesByLabel("Descripción del Producto");
    const quantities = getAllValuesByLabel("Cantidad");
    // "Precio unitario del Producto y/o Servicio"
    const prices = getAllValuesByLabel("Precio unitario");
    const tasas = getAllValuesByLabel("Tasa del IVA");
    // "Total bruto de la operación por ítem"
    const totals = getAllValuesByLabel("Total bruto");

    // Asumimos que la cantidad de descripciones define la cantidad de items
    // Usamos el maximo para iterar
    const count = Math.max(descriptions.length, quantities.length);

    for (let i = 0; i < count; i++) {
      const tasa = tasas[i] || "";
      const total = totals[i] || "0";

      let exenta = "0";
      let iva5 = "0";
      let iva10 = "0";

      if (tasa.includes("10")) iva10 = total;
      else if (tasa.includes("5")) iva5 = total;
      else exenta = total;

      // Solo agregamos si tiene datos minimos (ej: descripcion)
      // A veces los arrays pueden tener longitudes distintas si el xpath matchea cosas de mas
      // Un filtro simple: Si hay descripcion, es un item valido
      if (descriptions[i]) {
        items.push({
          codigo: codes[i] || "",
          cantidad: quantities[i] || "1",
          descripcion: descriptions[i],
          precio: prices[i] || "0",
          exenta,
          iva5,
          iva10
        });
      }
    }

  } catch (e) {
    console.error("Error extrayendo items", e);
  }
  return items;
}

function injectKudeButton() {
  // Verificamos si ya inyectamos el botón para no duplicarlo
  if (document.getElementById('kude-express-btn')) return;

  // Localizamos el contenedor principal de la consulta (ajustar selector según el DOM real de e-Kuatia)
  const container = document.querySelector('.v-card__title') || document.querySelector('h2') || document.body;

  if (container) {
    const btn = document.createElement('button');
    btn.id = 'kude-express-btn';
    btn.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        <span>Ver KUDE</span>
      </div>
    `;

    // Estilos del botón (Look & Feel Moderno - Compacto)
    Object.assign(btn.style, {
      backgroundColor: '#0052cc',
      color: 'white',
      padding: '6px 12px', // Más pequeño
      border: 'none',
      borderRadius: '6px', // Bordes un poco menos redondeados
      cursor: 'pointer',
      fontSize: '12px', // Fuente más chica
      fontWeight: '600',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      margin: '0 10px 10px 0', // Ajuste de margen para alinearse con los otros
      transition: 'all 0.2s ease'
    });

    btn.onmouseover = () => btn.style.backgroundColor = '#0041a3';
    btn.onmouseout = () => btn.style.backgroundColor = '#0052cc';

    btn.onclick = async () => {
      btn.textContent = "Procesando...";
      btn.disabled = true;

      // 1. Mapeo de datos detectados (según lista del usuario)
      const facturaData = {
        items: getItems(),
        cdc: getDataByLabel("CDC") || getDataByLabel("CDC:"),
        timbrado: getDataByLabel("Timbrado N°"),
        numero: getDataByLabel("N° de DTE"),
        tipo: getDataByLabel("Tipo de DTE"),
        fecha: getDataByLabel("Fecha y Hora de Emisión"),

        // Emisor
        emisor: getDataByLabel("Razón Social del Emisor"),
        ruc: getDataByLabel("RUC", 1),
        direccion_emisor: getDataByLabel("Dirección donde se emitió el DTE"),
        correo_emisor: getDataByLabel("Correo electrónico del emisor"),
        telefono_emisor: getDataByLabel("Teléfono local de emisión de DE"),

        // Receptor
        receptor: getDataByLabel("Nombre o Razón Social del Receptor"),
        ruc_receptor: getDataByLabel("RUC", 2),
        direccion_receptor: getDataByLabel("Dirección", 2) || getDataByLabel("Direccion", 2),
        telefono_receptor: getDataByLabel("Teléfono", 2),
        correo_receptor: getDataByLabel("Correo Electrónico"),

        condicion: getDataByLabel("Condición de Venta"),
        moneda: getDataByLabel("Moneda de la Operación"),

        // Totales
        total: getDataByLabel("Monto Total") || getDataByLabel("Total General") || getDataByLabel("Total"),
        iva_total: getDataByLabel("Liquidación del IVA") || getDataByLabel("Total IVA")
      };

      /* 
      // 2. MODO BASE DE DATOS (Desactivado temporalmente)
      // Descomentar esto cuando configures Supabase para soportar facturas grandes
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(facturaData)
        });

        if (response.ok) {
          const { id } = await response.json();
          window.open(`${VISOR_URL}?id=${id}`, '_blank');
          return; // Éxito, terminamos aquí
        }
      } catch (e) {
        console.log("Modo offline o sin base de datos activa.");
      }
      */

      // 3. MODO LOCAL (Por defecto)
      // Codificamos los datos en la URL en Base64
      const payload = btoa(unescape(encodeURIComponent(JSON.stringify(facturaData))));
      window.open(`${VISOR_URL}?data=${payload}`, '_blank');
      
      // Restaurar botón
      btn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          <span>Ver KUDE</span>
        </div>
      `;
      btn.disabled = false;
    };

    // INTENTO DE MEJOR POSICIONAMIENTO
    // Buscamos el botón "Descargar XML" para ponernos cerca
    const xpath = "//*[contains(text(), 'Descargar XML')]";
    const downloadBtnResult = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const downloadBtn = downloadBtnResult.singleNodeValue;

    if (downloadBtn) {
      // Encontramos el botón, nos insertamos en su contenedor padre
      // Opcional: Insertar ANTES del botón para que salga a la izquierda/arriba
      const parent = downloadBtn.closest('div') || downloadBtn.parentElement;
      if (parent) {
        // Ajuste de estilo para que no rompa el flex si existe
        btn.style.marginLeft = "10px";
        btn.style.marginRight = "15rem"; // Separación para centrar visualmente
        btn.style.marginBottom = "0px";
        // Insertamos al principio del contenedor de botones (izquierda) o append (derecha)
        parent.insertBefore(btn, parent.firstChild);
      } else {
        container.appendChild(btn);
      }
    } else {
      // Fallback: Si no hallamos el botón, lo ponemos donde antes
      container.appendChild(btn);
    }
  }
}

// Ejecutar cuando el DOM esté listo y observar cambios (por si la web de la SET es una SPA)
const observer = new MutationObserver(injectKudeButton);
observer.observe(document.body, { childList: true, subtree: true });
injectKudeButton();
