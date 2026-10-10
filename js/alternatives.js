// ========== ALTERNATIVES ==========
function renderAlternatives() {
  const tbody = document.getElementById("altBody");
  tbody.innerHTML = "";
  alternatives.forEach((a, i) => {
    tbody.innerHTML += `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><input type="text" class="form-control form-control-sm" value="${a.name}" onchange="alternatives[${i}].name=this.value"></td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-danger" onclick="removeAlternative(${i})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
  });
}

function addAlternative() {
  alternatives.push({ name: "Lokasi Baru" });
  renderAlternatives();
}

function removeAlternative(i) {
  if (alternatives.length <= 2) { alert("Minimal 2 lokasi"); return; }
  alternatives.splice(i, 1);
  renderAlternatives();
}