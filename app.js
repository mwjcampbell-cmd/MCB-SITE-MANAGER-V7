let state = JSON.parse(localStorage.getItem("mcb")) || {
  projects: [],
  diary: [],
  tasks: [],
  deliveries: [],
  inspections: []
};

const $ = s => document.querySelector(s);

function save() {
  localStorage.setItem("mcb", JSON.stringify(state));
}

function show(html) {
  $("#modal").innerHTML = html;
  $("#modalBack").classList.add("show");
}

function closeModal() {
  $("#modalBack").classList.remove("show");
}

function renderHome() {
  const today = new Date().toISOString().slice(0,10);

  const upcomingTasks = state.tasks.filter(t => t.due >= today);
  const upcomingDel = state.deliveries.filter(d => d.date >= today);
  const upcomingIns = state.inspections.filter(i => i.date >= today);

  $("#app").innerHTML = `
    <div class="card"><h2>Upcoming</h2>
      ${upcomingTasks.map(t=>`<div>🔧 ${t.title}</div>`).join("")}
      ${upcomingDel.map(d=>`<div>🚚 ${d.what}</div>`).join("")}
      ${upcomingIns.map(i=>`<div>🧑‍🔧 ${i.type}</div>`).join("")}
    </div>
  `;
}

function renderDiary() {
  $("#app").innerHTML = `
    <button class="primary" id="newDiary">New Diary Entry</button>
    ${state.diary.map(d=>`<div class="item" data-id="${d.id}">${d.text}</div>`).join("")}
  `;

  document.querySelectorAll(".item").forEach(i=>{
    i.onclick = ()=> viewDiary(i.dataset.id);
  });

  $("#newDiary").onclick = ()=> editDiary();
}

function viewDiary(id) {
  const d = state.diary.find(x=>x.id==id);
  show(`
    <h3>Diary</h3>
    <p>${d.text}</p>
    <button id="edit">Edit</button>
    <button id="close">Close</button>
  `);
  $("#edit").onclick = ()=> editDiary(d);
  $("#close").onclick = closeModal;
}

function editDiary(d={id:Date.now(), text:""}) {
  show(`
    <textarea id="text" style="width:100%;height:120px">${d.text}</textarea>
    <button id="save">Save</button>
    <button id="cancel">Cancel</button>
  `);

  $("#save").onclick = ()=>{
    d.text = $("#text").value;
    if(!state.diary.find(x=>x.id==d.id)) state.diary.push(d);
    save();
    closeModal();
    renderDiary();
  };

  $("#cancel").onclick = closeModal;
}

document.querySelectorAll("nav button").forEach(b=>{
  b.onclick = ()=>{
    if(b.dataset.view==="home") renderHome();
    if(b.dataset.view==="diary") renderDiary();
  };
});

renderHome();

if("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}