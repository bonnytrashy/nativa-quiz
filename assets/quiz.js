(function () {
  "use strict";

  var cfg = window.NATIVA_CONFIG || {};
  var WEBHOOK = cfg.webhook;
  var VARIANT = cfg.variant || "b2c";
  var WINNERS = cfg.winners || 3;

  var root = document.getElementById("quiz");

  // Definicao dos passos
  var steps = [];

  // 0 - Intro
  steps.push({
    tipo: "intro",
    html:
      '<span class="tag">Nova linha Brotinho</span>' +
      '<h1>Uma nova linha está chegando e tem um <span class="destaque">cheirinho especial</span> envolvido</h1>' +
      '<p class="lead">Quer descobrir quais são os ativos que compõem a fragrância do Brotinho?</p>' +
      '<p class="lead">Preparamos algumas pistas para você testar seus conhecimentos. No final, deixe seu palpite.</p>' +
      '<div class="badge-vagas">' +
        '<span class="num">' + WINNERS + '</span>' +
        '<span class="txt">As <strong>' + WINNERS + " primeiras pessoas</strong> que acertarem serão chamadas para participar de uma ação de conteúdo com a Nativa.</span>" +
      "</div>",
    botao: "Começar o desafio",
  });

  // 1 - Dados de contato
  steps.push({
    tipo: "form",
    passo: "Seus dados",
    titulo: "Antes de começar, se apresente",
    campos: [
      { key: "nome", label: "Nome completo", tipo: "text", placeholder: "Seu nome completo", obrigatorio: true },
      { key: "instagram", label: "Qual é o seu @ no Instagram?", tipo: "text", placeholder: "@seuusuario", obrigatorio: true },
      { key: "whatsapp", label: "Qual é o seu WhatsApp para contato?", tipo: "tel", placeholder: "(00) 00000-0000", obrigatorio: true },
    ],
  });

  // 2 - Pergunta 1
  steps.push({
    tipo: "pergunta",
    passo: "Pista 1 de 3",
    titulo: "1. O primeiro ativo",
    pista: "Um dos ativos é muito conhecido por sua <strong>casca alaranjada</strong> e <strong>aroma fresco</strong>. Qual pode ser?",
    campos: [{ key: "resposta1", label: "Seu palpite", tipo: "text", placeholder: "Digite aqui sua resposta", obrigatorio: true }],
  });

  // 3 - Pergunta 2
  steps.push({
    tipo: "pergunta",
    passo: "Pista 2 de 3",
    titulo: "2. O segundo ativo",
    pista: "A outra é uma <strong>fruta cítrica menor</strong>, de casca fácil de descascar e <strong>aroma doce</strong>. Qual pode ser?",
    campos: [{ key: "resposta2", label: "Seu palpite", tipo: "text", placeholder: "Digite aqui sua resposta", obrigatorio: true }],
  });

  // 4 - Pergunta 3 (palpite final)
  steps.push({
    tipo: "pergunta",
    passo: "Palpite final",
    titulo: "3. Juntando as pistas",
    pista: "Juntando as duas pistas, <strong>quais são os ativos</strong> da fragrância do Brotinho?",
    campos: [{ key: "resposta3", label: "Seu palpite final", tipo: "text", placeholder: "Ex: ativo 1 e ativo 2", obrigatorio: true }],
  });

  // 5 - Pergunta 4
  steps.push({
    tipo: "pergunta",
    passo: "Quase lá",
    titulo: "4. Sua motivação",
    campos: [{ key: "motivo", label: "Por que você quer participar da ação?", tipo: "textarea", placeholder: "Conte para a gente", obrigatorio: true }],
  });

  // 6 - Pergunta 5 (gate)
  steps.push({
    tipo: "gate",
    passo: "Última pergunta",
    titulo: "5. Vamos gravar juntos?",
    pergunta: "Se você passar no concurso, está disposta a gravar conteúdo?",
    campos: [{ key: "gravar", label: "", tipo: "radio", opcoes: ["Sim", "Não"], obrigatorio: true }],
  });

  var dados = {};
  var atual = 0;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function setProgress() {
    var total = steps.length;
    var pct = Math.round((atual / total) * 100);
    var bar = document.querySelector(".progress__bar");
    if (bar) bar.style.width = pct + "%";
  }

  function campoHTML(campo) {
    var wrap = el("label", "campo");
    if (campo.label) {
      var lbl = el("span", "campo-label", campo.label);
      wrap.appendChild(lbl);
    }
    var input;
    if (campo.tipo === "textarea") {
      input = el("textarea");
    } else if (campo.tipo === "radio") {
      var opc = el("div", "opcoes");
      campo.opcoes.forEach(function (o) {
        var row = el("label", "opcao");
        var radio = el("input");
        radio.type = "radio";
        radio.name = campo.key;
        radio.value = o;
        if (dados[campo.key] === o) { radio.checked = true; row.classList.add("selecionada"); }
        radio.addEventListener("change", function () {
          opc.querySelectorAll(".opcao").forEach(function (r) { r.classList.remove("selecionada"); });
          row.classList.add("selecionada");
        });
        row.appendChild(radio);
        row.appendChild(el("span", null, o));
        opc.appendChild(row);
      });
      wrap.appendChild(opc);
      wrap.dataset.key = campo.key;
      wrap.dataset.tipo = "radio";
      return wrap;
    } else {
      input = el("input");
      input.type = campo.tipo === "tel" ? "tel" : "text";
    }
    input.placeholder = campo.placeholder || "";
    input.name = campo.key;
    if (dados[campo.key]) input.value = dados[campo.key];
    wrap.appendChild(input);
    wrap.dataset.key = campo.key;
    wrap.dataset.tipo = campo.tipo;
    return wrap;
  }

  function render() {
    setProgress();
    root.innerHTML = "";
    var step = steps[atual];
    var container = el("div", "step active");

    if (step.tipo === "intro") {
      container.innerHTML = step.html;
    } else {
      if (step.passo) container.appendChild(el("span", "passo-num", step.passo));
      if (step.titulo) container.appendChild(el("h2", null, step.titulo));
      if (step.pista) container.appendChild(el("div", "pista", step.pista));
      if (step.pergunta) container.appendChild(el("p", "lead", step.pergunta));
      var camposWrap = el("div", null);
      camposWrap.style.marginTop = "20px";
      step.campos.forEach(function (c) { camposWrap.appendChild(campoHTML(c)); });
      container.appendChild(camposWrap);
    }

    var erro = el("div", "erro-msg");
    container.appendChild(erro);

    var nav = el("div", "nav");
    if (atual > 0) {
      var voltar = el("button", "btn-voltar", "Voltar");
      voltar.type = "button";
      voltar.addEventListener("click", function () {
        salvar(container);
        atual--;
        render();
      });
      nav.appendChild(voltar);
    }
    var avancar = el("button", "btn-principal");
    avancar.type = "button";
    avancar.textContent = step.botao || (atual === steps.length - 1 ? "Enviar respostas" : "Continuar");
    avancar.addEventListener("click", function () { proximo(container, erro, avancar); });
    nav.appendChild(avancar);
    container.appendChild(nav);

    root.appendChild(container);
    var primeiro = container.querySelector("input, textarea");
    if (primeiro && step.tipo !== "intro") setTimeout(function () { primeiro.focus(); }, 60);
  }

  function salvar(container) {
    container.querySelectorAll("[data-key]").forEach(function (w) {
      var key = w.dataset.key;
      if (w.dataset.tipo === "radio") {
        var checked = w.querySelector("input:checked");
        if (checked) dados[key] = checked.value;
      } else {
        var input = w.querySelector("input, textarea");
        if (input) dados[key] = input.value.trim();
      }
    });
  }

  function validar() {
    var step = steps[atual];
    if (!step.campos) return { ok: true };
    for (var i = 0; i < step.campos.length; i++) {
      var c = step.campos[i];
      if (!c.obrigatorio) continue;
      var val = dados[c.key];
      if (!val) return { ok: false, msg: "Por favor, preencha este campo para continuar." };
      if (c.key === "instagram" && val.length < 2) return { ok: false, msg: "Informe um @ válido do Instagram." };
      if (c.key === "whatsapp") {
        var nums = val.replace(/\D/g, "");
        if (nums.length < 10) return { ok: false, msg: "Informe um WhatsApp válido com DDD." };
      }
    }
    if (step.tipo === "gate" && dados.gravar === "Não") {
      return { ok: false, msg: "Para participar da ação é necessário estar disposta a gravar conteúdo." };
    }
    return { ok: true };
  }

  function proximo(container, erro, botao) {
    salvar(container);
    var v = validar();
    if (!v.ok) {
      erro.textContent = v.msg;
      erro.classList.remove("show");
      void erro.offsetWidth;
      erro.classList.add("show");
      return;
    }
    erro.classList.remove("show");

    if (atual === steps.length - 1) {
      enviar(botao, erro);
      return;
    }
    atual++;
    render();
  }

  function enviar(botao, erro) {
    botao.disabled = true;
    var original = botao.textContent;
    botao.innerHTML = '<span class="spinner"></span>Enviando...';

    var payload = {
      variante: VARIANT,
      vagas: WINNERS,
      nome: dados.nome || "",
      instagram: dados.instagram || "",
      whatsapp: dados.whatsapp || "",
      resposta_pista_1: dados.resposta1 || "",
      resposta_pista_2: dados.resposta2 || "",
      palpite_final: dados.resposta3 || "",
      motivo: dados.motivo || "",
      disposta_a_gravar: dados.gravar || "",
      origem: window.location.href,
      enviado_em: new Date().toISOString(),
    };

    fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        sucesso();
      })
      .catch(function () {
        botao.disabled = false;
        botao.textContent = original;
        erro.textContent = "Não conseguimos enviar agora. Verifique sua conexão e tente novamente.";
        erro.classList.remove("show");
        void erro.offsetWidth;
        erro.classList.add("show");
      });
  }

  function sucesso() {
    var bar = document.querySelector(".progress__bar");
    if (bar) bar.style.width = "100%";
    root.innerHTML = "";
    var f = el("div", "step active final");
    f.innerHTML =
      '<div class="icone">🍊</div>' +
      "<h2>Palpite enviado com sucesso!</h2>" +
      "<p>Obrigado por participar, <strong>" + (dados.nome ? escapar(dados.nome.split(" ")[0]) : "amiga") + "</strong>.</p>" +
      "<p>As <strong>" + WINNERS + " primeiras pessoas</strong> que acertarem serão chamadas pelo WhatsApp ou Instagram para produzir conteúdo com a Nativa. Fique de olho!</p>";
    root.appendChild(f);
  }

  function escapar(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  render();
})();
