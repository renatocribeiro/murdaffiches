import { avignonMap } from './map.js';
import { bookmarkletGeneratePage } from './bookmarklet.js';

export function parseParams(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var faveTitle = "Mur d'affiches";
  var defaultSort = "h";
  if (urlParams.has("n")){
    faveTitle = urlParams.get('n');
  }
  if (urlParams.has("s")){
    defaultSort = urlParams.get('s');
  }
  // av = a voir, pv = pas vu
  if (urlParams.has("av") || urlParams.has("pv")){
    const tagsString = urlParams.get('av');
    const suggestedString = urlParams.get('pv');
    showFaveMode(faveTitle, tagsString, suggestedString, defaultSort);
    return
  }
  
  creationMode();
}


function setFooter(){
  const footer = `
  <footer class="text-center d-flex flex-column justify-content-center py-2" id="footerDisclaimer">
    <div class="footerRow">Le 'mur d'affiches' est un projet open source indépendant.</div>
    <div class="footerRow">Il n’est ni affilié ni soutenu par AF&C.</div>
    <div class="footerRow">Dernière mise à jour des données : 02 juillet 2025 à 21h00</div>
    <div class="footerRow">Le code source est disponible <a class="custom-link" href="https://github.com/renatocribeiro/murdaffiches" target="_blank">ici</a></div>
    <div class="footerRow">Vous trouverez d'autres ressources sur <a class="custom-link" href="https://www.lesartsvivants.org" target="_blank">lesartsvivants.org</a></div>
  </footer>`;
  $("body").append(footer);
}

function setShareButtons(faveTitle){
  const buttons = `
    <div>
      <div class="btn-group" role="group">
        <button type="button" class="btn btnShare" role="button" id="homeBtn"><i class="fa-solid fa-house" onclick="window.open('/murdaffiches', '_blank')"></i></button>
        <button type="button" class="btn btnShare"><a href="" id="mailBtn" style="color: black;"><i class="fa-solid fa-envelope"></i></a></button>
        <button type="button" class="btn btnShare" id="clipboardBtn"><i class="fa-solid fa-clipboard"></i></button>
      </div>  
    </div>`;
  $("#footerDisclaimer").prepend(buttons);
  
  $('#mailBtn').attr("href", `mailto:?Subject=${encodeURIComponent(faveTitle)}&body=${encodeURIComponent(window.location.href)}`);
  const tooltip = new bootstrap.Tooltip($("#clipboardBtn"), {
    trigger: 'manual',
    placement: 'top',
    animation: true,
    title: "Copié",
  });
  $('#clipboardBtn').on('click', function() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
    .then(() => {
      tooltip.show();
      setTimeout(() => {
        tooltip.hide();
      }, 1000);
    })
    .catch(err => {
      console.error("Failed to copy text: ", err);
    });
  });
}
function setQrCode() {
  const qr = `
  <div class="d-flex justify-content-center align-items-center bt-3 mb-3">
    <div class="img-fluid" id="qrcode"></div>
  </div>`;
  $("body").append(qr);

  const qrcode = document.getElementById('qrcode')
  if (qrcode && qrcode.innerHTML.trim() === '') {
    const qrcode = new QRCode(document.getElementById('qrcode'), {
      text: window.location.href,
      // width: 200,
      // height: 200,
      colorDark : '#000',
      colorLight : '#fff',
      correctLevel : QRCode.CorrectLevel.H
    });
  }
}

function creationMode() {
  const home = `
  <h1 class="text-center my-4" id="h1-title">Mur d'affiches</h1>
  <h5 class="text-center my-4">Choisissez une option pour commencer</h5>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-4 colSquare300" role="button" data-bs-toggle="modal" data-bs-target="#copyModal">
        <div class="card cardSquare300 hover-border" id="cardCopy">
          <div class="card-body">
            <h5 class="card-title">Génération à partir de liens</h5>
            <p class="card-text">Collez des liens de spectacles présents sur festivaloffavignon.com pour générer votre mur d'affiches.</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-4 colSquare300" role="button" data-bs-toggle="modal" data-bs-target="#uploadModal">
        <div class="card cardSquare300 hover-border">
          <div class="card-body">
            <h5 class="card-title">Générer un mur d'affiches de vos favoris (html)</h5>
            <p class="card-text"></p>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-4 colSquare300" role="button" data-bs-toggle="modal" data-bs-target="#bookmarkletModal">
        <div class="card cardSquare300 hover-border">
          <div class="card-body">
            <h5 class="card-title">Générer un mur d'affiches de vos favoris (marque-page)</h5>
            <p class="card-text"></p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="copyModal" tabindex="-1" role="dialog" aria-labelledby="copyModalTitle" show="false">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Génération à partir de liens</h5>
        </div>
        <div class="modal-body" id="copyModalBody">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          <button type="button" class="btn btn-primary" id="copySendBtn">Voir mon Mur d'affiches !</button>
        </div>
      </div>
    </div>
  </div>


  <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalTitle" show="false">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Générer un Mur d'affiches sur le site du Off</h5>
        </div>
        <div class="modal-body" id="uploadModalBody">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          <button type="button" class="btn btn-primary" id="uploadSendBtn">Voir mon Mur d'affiches !</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="bookmarkletModal" tabindex="-1" role="dialog" aria-labelledby="bookmarkletModalTitle" show="false">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Créer via Marque-page</h5>
        </div>
        <div class="modal-body" id="bookmarkletModalBody">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
        </div>
      </div>
    </div>
  </div>
  `;
  $("body").append(home);
  setCopyModal();
  setUploadModal();
  setBookmarkletModal();
  setFooter();
}

function setCopyModal() {
  const $container = $("<div>", {class : "container"}).appendTo("#copyModalBody");
  
  const $rowtitle = $("<div>", {class : "row justify-content-center"}).appendTo($container);
  const $colTitle = $("<div>", {class : "col"}).appendTo($rowtitle);
  const $mbTitle = $("<div>", {class : "mb-3"}).appendTo($colTitle);
  
  const $form = $("<form>", {id : "formUrls"}).appendTo($container);
  
  const $rowName = $("<div>", {class : "row justify-content-center"}).appendTo($form);
  const $colName = $("<div>", {class : "col"}).appendTo($rowName);
  const $mbName = $("<div>", {class : "mb-3"}).appendTo($colName);

  const $lblName = $("<label>", {for: "inputName", text:"Veuillez saisir le titre de votre Mur d'affiches :"}).appendTo($mbName);
  const $inputName = $("<input>", {type: "text", class: "form-control", id: "inputName", value: "Mur d'affiches de Paul " + moment().format('DD/MM/YYYY à HH:mm'), required: true}).appendTo($mbName);


  const $row = $("<div>", {class : "row justify-content-center"}).appendTo($form);
  const $col = $("<div>", {class : "col"}).appendTo($row);
  const $mb = $("<div>", {class : "mb-3"}).appendTo($col);
  const $label = $("<label>", {for: "textAreaUrls", text: "Veuillez saisir les URLs pointant vers des pages de spectacles sur le site officiel du Off:"}).appendTo($mb);
  const $textArea = $("<textarea>", {class: "form-control", id: "textAreaUrls", rows: 10, placeholder: "https://www.festivaloffavignon.com/spectacles/0123-le-spectacle-qui-n-existe-pas\nhttps://www.festivaloffavignon.com/spectacles/4567-un-autre-spectacle", required: true}).appendTo($mb);
  const $smallUrls = $("<small>", {class: "form-text text-muted", text: "Ce champ accepte plusieurs URL, séparées par tout type de délimiteur (espace, virgule, point-virgule, etc.)."}).appendTo($mb);

  const $rowBtm = $("<div>", {class : "row justify-content-center"}).appendTo($form);
  const $colBtn = $("<div>", {class : "col"}).appendTo($rowBtm);
  const $mbBtn = $("<div>", {class : "mb-3"}).appendTo($colBtn);

  $('#copySendBtn').on('click', function() {
    const textarea = document.getElementById("textAreaUrls");
    const urls = textarea.value
  
    const newUrl = parseUrls(urls);
    window.open(newUrl, '_blank');
  });
}

function setUploadModal() {
  const $container = $("<div>", {class : "container"}).appendTo("#uploadModalBody");
  const $rowtitle = $("<div>", {class : "row justify-content-center"}).appendTo($container);
  const $colTitle = $("<div>", {class : "col"}).appendTo($rowtitle);
  const $mbTitle = $("<div>", {class : "mb-3"}).appendTo($colTitle);
  const instructions = `Rendez vous sur https://www.festivaloffavignon.com/espace-client/mes-favoris.<br>
    Appuyez sur CTRL+S ou ⌘+S.<br>
    Choisissez l’emplacement où vous voulez sauvegarder le fichier.<br>
    Cliquez sur le bouton de chargement ci-dessous et sélectionnez le fichier html.<br>
    Cliquez sur le bouton 'Voir mon Mur d'affiches !'.`;
  $("<p>", {html: instructions}).appendTo($mbTitle);

  const $lblName = $("<label>", {for: "inputNameUpload", text:"Veuillez saisir un nom pour mon Mur d'affiches:"}).appendTo($mbTitle);
  const $inputName = $("<input>", {type: "text", class: "form-control", id: "inputNameUpload", value: "Mur d'affiches de Paul " + moment().format('DD/MM/YYYY à HH:mm'), required: true}).appendTo($mbTitle);


  const $uploadTitle = $("<label>", {for: "formFile", class: "form-label", text: "Téléchargez votre fichier:"}).appendTo($mbTitle);
  const $inputTitle = $("<input>", {class : "form-control", type: "file", id: "formFile"}).appendTo($mbTitle);
  let selectedFile = null;
      document.getElementById('formFile').addEventListener('change', function(event) {
      selectedFile = event.target.files[0];
    });

    document.getElementById('uploadSendBtn').addEventListener('click', function() {
      if (!selectedFile) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const htmlContent = e.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const cardImages = doc.querySelectorAll('a.card-image');
        var ids = [];
        cardImages.forEach((card, i) => {
          const regex = /https:\/\/www\.festivaloffavignon\.com\/spectacles\/(\d*)-\s*/g;
          const idArr = [...card.href.matchAll(regex)].map(match => match[1]);
          ids.push(idArr[0]);
        });
        const uniqueIds = [...new Set(ids)];
        const inputName = $("#inputNameUpload").val();
        const newUrl = `${window.location.href}?p=${uniqueIds.join()}&n=${inputName}`;
        window.open(newUrl, '_blank');
      };

      reader.readAsText(selectedFile);
    });
}


function setBookmarkletModal() {
  const $container = $("<div>", {class : "container"}).appendTo("#bookmarkletModalBody");
  const $rowtitle = $("<div>", {class : "row justify-content-center"}).appendTo($container);
  const $colTitle = $("<div>", {class : "col"}).appendTo($rowtitle);
  const $mbTitle = $("<div>", {class : "mb-3"}).appendTo($colTitle);
  $("<p>", {text : "Pour commencer, faites glisser (drag & drop) le lien du marque-page proposé plus bas la barre de favoris de votre navigateur."}).appendTo($mbTitle);
  $("<p>", {text : "Ensuite, rendez vous sur la page de favoris de festivaloffavignon.com et cliquez sur le marque-page dans la barre de votre navigateur pour générer automatiquement votre mur d'affiches."}).appendTo($mbTitle);
  const bookmarkletStr = getBookmarkletUriEncoded();
  const $aBookmarklet = $("<a>", {href : bookmarkletStr, text: "marque-page", style: "color: black;"}).appendTo($mbTitle);

}

function parseUrls(urls) {
  const regex = /https:\/\/www\.festivaloffavignon\.com\/spectacles\/(\d*)-\s*/g;
  const idsArray = [...urls.matchAll(regex)].map(match => match[1]);
  const uniqueArray = [...new Set(idsArray)];

  const inputName = $("#inputName").val();
  return `${window.location.href}?p=${uniqueArray.join()}&n=${inputName}`;
}

function getBookmarkletUriEncoded() {
  const funcStr = bookmarkletGeneratePage.toString();
  const iifeStr = `(${funcStr})()`;
  const encoded = encodeURIComponent(iifeStr);
  const bookmarklet = `javascript:${encoded}`;
  return bookmarklet;
}

function getDateText(beg, end) {
  if (beg === end) {
    return `le ${beg} juillet`
  } else {
    return `du ${beg} au ${end} juillet`
  }
}

function formatHour(s) {
  return s.replace(":", "h");
}

function sortByDefaut(mymap, asc) {
  if (asc) {
    return mymap;
  } else {
    return new Map([...mymap.entries()].reverse());
  }
}

function sortByHeure(mymap, asc) {
  var sortedMap = new Map(
    [...mymap.entries()].sort(([, a], [, b]) => {
      const timeA = a[6];
      const timeB = b[6];
      const [hA, mA] = timeA.split(':').map(Number);
      const [hB, mB] = timeB.split(':').map(Number);
      return hA !== hB ? hA - hB : mA - mB;
    })
  );
  if (asc) {
    return sortedMap;
  } else {
    return new Map([...sortedMap.entries()].reverse());
  }
}

function sortByLieu(map, asc) {
  var sortedMap = new Map(
    [...map.entries()].sort(([, a], [, b]) => {
      const strA = a[9];
      const strB = b[9];
      return strA.localeCompare(strB);
    })
  );
  if (asc) {
    return sortedMap;
  } else {
    return new Map([...sortedMap.entries()].reverse());
  }
}

function sortByTitre(map, asc) {
  var sortedMap = new Map(
    [...map.entries()].sort(([, a], [, b]) => {
      const strA = a[0];
      const strB = b[0];
      return strA.localeCompare(strB);
    })
  );
  if (asc) {
    return sortedMap;
  } else {
    return new Map([...sortedMap.entries()].reverse());
  }
}

function sortByType(map, asc) {
  var sortedMap = new Map(
    [...map.entries()].sort(([, a], [, b]) => {
      const strA = a[10];
      const strB = b[10];
      return strA.localeCompare(strB);
    })
  );
  if (asc) {
    return sortedMap;
  } else {
    return new Map([...sortedMap.entries()].reverse());
  }
}

function applySort(map, sortBy, asc) {
  switch (sortBy) {
    case "défaut":
      return sortByDefaut(map, asc);
    case "heure":
      return sortByHeure(map, asc);
    case "lieu":
      return sortByLieu(map, asc);
    case "titre":
      return sortByTitre(map, asc);
    case "type":
      return sortByType(map, asc);
    default:
      console.log("wrong sortby -", sortBy);
      return map;
  }
}

function isDummy(str) {
  const num = Number(str);
  return !isNaN(num) && num >= 1000 && num <= 1100;
}

function drawCards(subMap, cardsContainer) {
  var asc = false;
  var sortBy = "";
  const selectedItem = $('#dropdownSort .dropdown-item.active');
  if (selectedItem.length > 0) {
    const value = selectedItem.attr('data-value');
    const label = selectedItem.text();
    sortBy = value;
  } else {
    sortBy = "heure";
  }
  const sortIcon = $("#sortDirection").find('i');
    if (sortIcon.hasClass('fa-arrow-down-wide-short')) {
      asc = false;
    } else {
      asc = true;
    }

  const sortedMap = applySort(subMap, sortBy, asc);
  const $row = $("<div>", { class: "row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-5 row-cols-xxl-6 gy-4" });
  for (const [id, vals] of sortedMap) {
      const name = vals[0]
      const url = `http://www.festivaloffavignon.com/spectacles/${id}-${vals[1]}`;
      const url_image = isDummy(id) ? vals[2] : `https://www.festivaloffavignon.com/data/spectacles/${id}-${vals[2]}-catalogue.${vals[3]}`;
      const beg = vals[4];
      const end = vals[5];
      const heure = formatHour(vals[6]);
      const heureFin = formatHour(vals[7]);
      const duree = formatHour(vals[8]);
      const location = vals[9];
      const genre = vals[10] == "nan" ? '' : vals[10];

      const $col = $("<div>", { class: "col" }).appendTo($row);
      const $card = $("<div>", { class: "card h-100 hover-border"}).appendTo($col);
      const $aImg = $("<a>", { href: url, target: "_blank"}).appendTo($card);
      const $divImg = $("<div>", {class: "image-crop"}).appendTo($aImg);
      const $img = $("<img>", {class: "card-img-top img-fluid", src: url_image, alt: url_image}).appendTo($divImg);
      const $cardBody = $("<div>", { class: "card-body" }).appendTo($card);
      
      const $rowTitle = $("<div>", {class: "row"}).appendTo($cardBody);   
      const $colTitle = $("<div>", {class: "col col-box", style:"--height: 20px"}).appendTo($rowTitle);    
      const $aTitle = $("<a>", { href: url, target: "_blank", class: "text-decoration-none text-reset"}).appendTo($colTitle);
      const $cardTitle = $("<h6>", { class: "card-title truncate-lines", text: name, style:"--lines: 1"}).appendTo($aTitle);    
      
      const $rowLocation = $("<div>", {class: "row"}).appendTo($cardBody);   
      const $colLocation = $("<div>", {class: "col col-box", style:"--height: 20px"}).appendTo($rowLocation);    
      const $location = $("<small>", { class: "text-muted truncate-lines", text: location, style:"--lines: 1"}).appendTo($colLocation);

      const $rowDate = $("<div>", {class: "row"}).appendTo($cardBody);   
      const $colDate = $("<div>", {class: "col"}).appendTo($rowDate);    
      const $date = $("<p>", { class: "cardRow m-0", text: getDateText(beg, end)}).appendTo($colDate);

      const $rowTime = $("<div>", {class: "row"}).appendTo($cardBody);   
      const $colTime = $("<div>", {class: "col"}).appendTo($rowTime);    
      const $time = $("<p>", { class: "cardRow m-0", text: `${heure}→${heureFin} · ${duree}`}).appendTo($colTime);

      const $rowGenre = $("<div>", {class: "row"}).appendTo($cardBody);   
      const $colGenre = $("<div>", {class: "col"}).appendTo($rowGenre);    
      const $genre = $("<p>", { class: "cardRow m-0", text: genre}).appendTo($colGenre);
    };
  $(cardsContainer).html($row); 
}

function setDefaultDropdown(sortStr) {
  switch (sortStr) {
    case "d":
      $("#dropdownDefaut").addClass('active dropdownItemSort');
      $('#btnGroupSort').text("Trié par " + $("#dropdownDefaut").data("value") + ' ');
      return
    case "h":
      $("#dropdownHeure").addClass('active dropdownItemSort');
      $('#btnGroupSort').text("Trié par " + $("#dropdownHeure").data("value") + ' ');
      return
    case "l":
      $("#dropdownLieu").addClass('active dropdownItemSort');
      $('#btnGroupSort').text("Trié par " + $("#dropdownLieu").data("value") + ' ');
      return
    case "t":
      $("#dropdownTitre").addClass('active dropdownItemSort');
      $('#btnGroupSort').text("Trié par " + $("#dropdownTitre").data("value") + ' ');
      return
    case "y":
      $("#dropdownType").addClass('active dropdownItemSort');
      $('#btnGroupSort').text("Trié par " + $("#dropdownType").data("value") + ' ');
      return
    default:
      console.log("wrong default sort string -", sortStr);
      console.log("defaulting to heure");
      $("#dropdownHeure").addClass('active dropdownItemSort');
      $('#btnGroupSort').text("Trié par " + $("#dropdownHeure").data("value") + ' ');
      return
  }
}

function showFaveMode(faveTitle, strParams, strSuggested, defaultSort) {
  $('meta[property="og:url"]').attr('content', window.location.href);
  const avIdArray = strParams ? strParams.split(',') : [];
  const avSubMap = new Map(
    avIdArray
      .filter(key => avignonMap.has(key))
      .map(key => [key, avignonMap.get(key)])
  );

  const pvIdArray = strSuggested ? strSuggested.split(',') : [];
  const pvSubMap = new Map(
    pvIdArray
      .filter(key => avignonMap.has(key))
      .map(key => [key, avignonMap.get(key)])
  );

  const title = `<p class="showModeTitle">${faveTitle}</p>`;
  $("body").append(title);
  const pvTitle = pvSubMap.size > 0
    ? `<div id="cards-pv-title" class="container mt-3"><h4 class="mb-2">Je veux voir :</h4></div>`
    : "";
  
  const sort = `
  <div class="container">
    <div class="row">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h4 class="mb-2">À voir</h4>
        <div class="btn-group me-2 mb-2" role="group" aria-label="Button group with nested dropdown">
          <button id="btnGroupSort" type="button" class="btn btn-primary dropdown-toggle btn-sm btnSort dropdownMenuSort" data-bs-toggle="dropdown" aria-expanded="false"></button>
          <ul class="dropdown-menu" id="dropdownSort">
            <li><a class="dropdown-item dropdownItemSort" href="#" data-value="défaut"  id="dropdownDefaut">Défaut</a></li>
            <li><a class="dropdown-item dropdownItemSort" href="#" data-value="heure" id="dropdownHeure">Heure</a></li>
            <li><a class="dropdown-item dropdownItemSort" href="#" data-value="lieu" id="dropdownLieu">Lieu</a></li>
            <li><a class="dropdown-item dropdownItemSort" href="#" data-value="titre" id="dropdownTitre">Titre</a></li>
            <li><a class="dropdown-item dropdownItemSort" href="#" data-value="type" id="dropdownType">Type</a></li>
          </ul>
          <button type="button" class="btn btn-primary btn-sm btnSort" id="sortDirection"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
        </div>
      </div>
    </div>
  </div>
  <div id="cards" class="container"></div>
  ${pvTitle}
  <div id="cards-pv" class="container"></div>`;
  $("body").append(sort);
  setDefaultDropdown(defaultSort);
  drawCards(avSubMap, "#cards");
  if (pvSubMap.size > 0) {
    drawCards(pvSubMap, "#cards-pv");
  }

  $('#dropdownSort').on('click', '.dropdown-item', function (e) {
    e.preventDefault();

    $('#dropdownSort .dropdown-item').removeClass('active');
    $(this).addClass('active dropdownItemSort');
    $('#btnGroupSort').text("Trié par " + $(this).data("value") + ' ');
    drawCards(avSubMap, "#cards");
    if (pvSubMap.size > 0) {
      drawCards(pvSubMap, "#cards-pv");
    }
  });

  $('#sortDirection').click(function() {
    const icon = $(this).find('i');
    if (icon.hasClass('fa-arrow-down-wide-short')) {
      icon.removeClass('fa-arrow-down-wide-short').addClass('fa-arrow-up-wide-short');
    } else {
      icon.removeClass('fa-arrow-up-wide-short').addClass('fa-arrow-down-wide-short');
    }
    drawCards(avSubMap, "#cards");
    if (pvSubMap.size > 0) {
      drawCards(pvSubMap, "#cards-pv");
    }
  });
  setFooter();
  setShareButtons(faveTitle);
  setQrCode();
}