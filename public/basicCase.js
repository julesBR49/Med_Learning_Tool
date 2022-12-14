
const caseInfo = JSON.parse(window.sessionStorage.getItem("currentCase"));

console.log(caseInfo);

const parseTestData = function(test_array, case_id){
    const testsDict = JSON.parse(window.sessionStorage.getItem("testsDict"));
    const testResultsDict = JSON.parse(window.sessionStorage.getItem("testResultsDict"));

    const parsedTests = test_array.map((elem) => {
        const el = elem.toLowerCase().replace(" ", "");
        let results = "test not recognized";
        let test_id = "";
        let result_id = "";
        if (testsDict[el] !== undefined){
            results = testsDict[el].normal_results;
            test_id = testsDict[el].id;
        }
        if (testResultsDict[test_id + case_id] !== undefined){
            result_id = test_id + case_id;
            results = testResultsDict[result_id].results;
        };
        return {
            "test": elem,
            "results": results,
            "id": result_id
    };
    });
    return parsedTests;
};

const formatUL = (arrayToFormat) => {
    if (arrayToFormat.length !== 0){
        return "<ul><li>"+arrayToFormat.join("</li><li> ") + "</li></ul>";
    }
    else {
        return "";
    }
};

const showImg = (imgPath, thisNode) => {
    console.log(imgPath);
    const img_node = document.createElement("img");
    thisNode.appendChild(img_node);
    img_node.src = imgPath;
    img_node.className = "test_result_img";
}

const getCase = async () => {
    console.log("in getCase");
    const symptomsDict = JSON.parse(window.sessionStorage.getItem("symptomsDict"));
    // const PE_Dict = JSON.parse(window.sessionStorage.getItem("PE_Dict"));
    console.log(caseInfo.symptoms);
    console.log("hi");
    const symp = caseInfo.symptoms.map((obj) => symptomsDict[obj].name);
    console.log(symptomsDict);
    console.log(symp);
    const patient_profile = ["standard_patient.png"];
    console.log(caseInfo.patient);
    if (caseInfo.patient != "" && caseInfo.patient != undefined){
        patient_profile.push(...caseInfo.patient.split(","));
    }
    const this_patient = patient_profile[Math.floor(Math.random() * patient_profile.length)];
    console.log(this_patient);
    //console.log("prim");
    // const secSymp = caseInfo.secondarySymptoms.map((obj) => symptomsDict[obj].name);
    //console.log("sec");
    // const PEfindings = caseInfo.PEfindings.map((obj) => PE_Dict[obj].name);
    //console.log("pe");

    //console.log("html");
    document.getElementById("symptoms").innerHTML = formatUL(symp);
    // document.getElementById("secondarySymptoms").innerHTML = formatUL(secSymp);


    showImg("patients/" + this_patient.replace(" ", ""), document.getElementById("patient"));

};

const diag_form  = document.getElementById('diagnosisInput');
diag_form.addEventListener('submit', (event) => {
    //console.log("event listener called");
    event.preventDefault();
    new FormData(diag_form);
});

diag_form.addEventListener('formdata', async (event) => {
    const diagnosis = event.formData.get("diagnosis");
    let num = 0; // incorrect
    // console.log(diagnosis)
    const diag_div = document.getElementById('diagnosisFeedback');
    
    const treatmentsDict = JSON.parse(window.sessionStorage.getItem("treatmentsDict"));

    const treatments = caseInfo.treatments.map((obj) => treatmentsDict[obj]);
    console.log(treatments);
    const diag_names = diagnosis.split(",");
    diag_names.forEach((el) => {
        if (el.toLowerCase() == caseInfo.name.toLowerCase()){
            num = 1;
        }
    });
    if (num == 1){
        console.log("correct");
        diag_div.innerHTML = `
        <p> Correct!!!!! </p>
        <p> Treatments: ${treatments}</p>
        `
    }
    else {
        console.log('incorrect - ', caseInfo.name);
        diag_div.innerHTML = `
        <p> Incorrect :( </p>
        <p> Diagnosis is in fact ${caseInfo.name}</p>
        <p> Treatments: ${treatments}</p>
        `
    };
    console.log(JSON.stringify({
        number: num,
        id: caseInfo.id
    }));
    // container.append(diag_div);
    const updated = await fetch("http://localhost:8000/update_difficulty", {
        method: "POST",
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify({
            number: num,
            id: caseInfo.id
        })
    });
    console.log("adding div");
    // container.append(div);
});


    // const submitButton = document.getElementById("submitTests");
const test_form  = document.getElementById('testsInput');
test_form.addEventListener('submit', (event) => {
    console.log("event listener called");
    event.preventDefault();
    new FormData(test_form);
});

test_form.addEventListener('formdata', (event) => {
    const data = event.formData;
    const test_data = data.get("tests").split(",");
    const test_info = parseTestData(test_data, caseInfo.id) ;
    const result_div = document.getElementById("testResultsDiv");
    test_info.forEach((value) => {
            const test_node = document.createElement("h4");
            const test_text_node = document.createTextNode(value.test);
            test_node.appendChild(test_text_node);
            result_div.appendChild(test_node);

            const res_node = document.createElement("p");
            // div.classList.add("userContainer");

            value.results.split(",").forEach((result) => {
                console.log(result);
                if (result.endsWith(".png") || result.endsWith(".jpeg") || result.endsWith(".jpg")){
                    const imgPath = "images/" + result;
                    const img_node = document.createElement("img");
                    res_node.appendChild(img_node);
                    img_node.src = imgPath;
                    img_node.className = "test_result_img";
                }
                else {
                    const res_value_node = document.createTextNode(result);
                    res_node.appendChild(res_value_node);
                };
                res_node.appendChild(document.createElement("br"));
            });

            // if (value.results.endsWith(".png") || value.results.endsWith(".jpeg") || value.results.endsWith(".jpg")){
            //     const imgPath = "images/" + value.results;
            //     const img_node = document.createElement("img");
            //     res_node.appendChild(img_node);
            //     img_node.src = imgPath;
            //     img_node.className = "test_result_img";



                // img_node.max-width = 90;
    
            //     div.innerHTML = `
            //     <h3>${value.test}</h3>
            //     <p><img src=${imgPath} class="img"></p>
            // `;


            // }
            // else {
            //     const res_value_node = document.createTextNode(value.results);
            //     res_node.appendChild(res_value_node);
                


            //     div.innerHTML = `
            //     <h3>${value.test}</h3>
            //     <p>${value.results}</p>
            // `;

            // };
            result_div.appendChild(res_node);
            res_node.scrollIntoView();
            test_form.reset()

            // container.append(div);
    });
});


const openCaseButton = document.getElementById("newCaseButton");


openCaseButton.addEventListener("click", async function() {
    
    console.log("calling");
    const resp = await fetch("http://localhost:8000/case");
    const caseInfo = await resp.json();
    window.sessionStorage.setItem("currentCase", JSON.stringify(caseInfo));
    location.href = "http://localhost:8000/basicCase.html";
    // getNewCase();
    // getNewCase(symptomsDict_Glob, testsDict_Glob, testResultsDict_Glob, PE_Dict_Glob, treatmentsDict_Glob)
});

await getCase();