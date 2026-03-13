var LIFF_ID = "2009439411-BathCPyi";
var API_URL = "https://script.google.com/macros/s/AKfycbzthokXvdsVI7QVkB96GmP1lK2u_qNqaOqb4_QrpUIpBl0k3qEcw906oXrqFU4czGnk/exec";

function getChecked(name) {
  var els = document.querySelectorAll('input[name="' + name + '"]:checked');
  var vals = [];
  for (var i = 0; i < els.length; i++) { vals.push(els[i].value); }
  return vals.join("、");
}

function checkAge() {
  var val = document.getElementById("birthday").value;
  if (!val) return;
  var p = val.split("-");
  var birth = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
  var today = new Date();
  var age = today.getFullYear() - birth.getFullYear();
  var m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  document.getElementById("age-display").innerHTML =
    '<span style="display:inline-block;background:#e8f5e9;color:#2e7d32;font-size:13px;padding:4px 12px;border-radius:20px;">年齢：' + age + '歳</span>';
  var radios = document.querySelectorAll('input[name="age_group"]');
  if (age < 15) { radios[1].checked = true; } else { radios[0].checked = true; }
}

function doSubmit() {
  var name = document.getElementById("name").value.trim();
  var birthday = document.getElementById("birthday").value;
  var ageGroup = getChecked("age_group");
  if (!name) { alert("お名前を入力してください。"); return; }
  if (!birthday) { alert("生年月日を入力してください。"); return; }
  if (!ageGroup) { alert("年齢区分を選択してください。"); return; }

  var data = {
    name: name, birthday: birthday, age_group: ageGroup,
    phone: document.getElementById("phone").value
  };
  if (ageGroup === "15歳以上") {
    data.current_med     = getChecked("a_current_med");
    data.current_med_det = document.getElementById("a_current_med_detail").value;
    data.otc             = getChecked("a_otc");
    data.otc_det         = document.getElementById("a_otc_detail").value;
    data.allergy         = getChecked("a_allergy");
    data.allergy_det     = document.getElementById("a_allergy_detail").value;
    data.sideeffect      = getChecked("a_sideeffect");
    data.sideeffect_det  = document.getElementById("a_sideeffect_detail").value;
    data.disease         = getChecked("a_disease");
    data.disease_other   = document.getElementById("a_disease_other").value;
    data.pregnancy       = getChecked("a_pregnancy");
    data.smoke           = getChecked("a_smoke");
    data.alcohol         = getChecked("a_alcohol");
    data.symptom         = document.getElementById("a_symptom").value;
    data.other           = document.getElementById("a_other").value;
  } else {
    data.weight          = document.getElementById("c_weight").value;
    data.current_med     = getChecked("c_current_med");
    data.current_med_det = document.getElementById("c_current_med_detail").value;
    data.allergy         = getChecked("c_allergy");
    data.allergy_det     = document.getElementById("c_allergy_detail").value;
    data.sideeffect      = getChecked("c_sideeffect");
    data.sideeffect_det  = document.getElementById("c_sideeffect_detail").value;
    data.clinic          = getChecked("c_clinic");
    data.clinic_name     = document.getElementById("c_clinic_name").value;
    data.symptom         = document.getElementById("c_symptom").value;
    data.guardian        = document.getElementById("c_guardian").value;
    data.other           = document.getElementById("c_other").value;
  }

  try {
    fetch(API_URL, { method:"POST", mode:"no-cors",
      headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
  } catch(e) {}

  var msg = "【リーフ薬局 問診票】\n名前："+data.name+"\n生年月日："+data.birthday+
    "\n区分："+data.age_group+"\n症状："+(data.symptom"未記入")+
    "\nアレルギー："+(data.allergy
"なし")+"\n服用中の薬："+(data.current_med||"なし");
  try {
    if (liff.isInClient()) {
      liff.sendMessages([{ type:"text", text:msg }]);
    }
  } catch(e) {}

  document.getElementById("form-area").style.display = "none";
document.getElementById("complete-msg").style.display = "block";
}

window.addEventListener("load", function() {
  document.getElementById("birthday").onchange = checkAge;
  document.getElementById("submit-btn").onclick = doSubmit;
  try { liff.init({ liffId: LIFF_ID }); } catch(e) {}
});
