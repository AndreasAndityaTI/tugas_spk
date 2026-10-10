// ========== CRITERIA ==========
function renderCriteria() {
  const tbody = document.getElementById("criteriaBody");
  tbody.innerHTML = "";
  criteria.forEach((c, i) => {
    tbody.innerHTML += `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><input type="text" class="form-control form-control-sm" value="${c.name}" onchange="criteria[${i}].name=this.value"></td>
        <td>
          <select class="form-select form-select-sm" onchange="criteria[${i}].type=this.value">
            <option value="benefit" ${c.type === "benefit" ? "selected" : ""}>Benefit (↑ lebih baik)</option>
            <option value="cost" ${c.type === "cost" ? "selected" : ""}>Cost (↓ lebih baik)</option>
          </select>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-danger" onclick="removeCriteria(${i})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
  });
}

function addCriteria() {
  criteria.push({ name: "Kriteria Baru", type: "benefit" });
  renderCriteria();
}

function removeCriteria(i) {
  if (criteria.length <= 2) { alert("Minimal 2 kriteria"); return; }
  criteria.splice(i, 1);
  renderCriteria();
}