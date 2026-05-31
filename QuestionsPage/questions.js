// Mock Data for Dependent Dropdowns
const locationData = {
    USA: {
        CA: ["Los Angeles", "San Francisco", "San Diego"],
        NY: ["New York City", "Buffalo", "Rochester"],
        TX: ["Austin", "Houston", "Dallas"],
        MA: ["Boston", "Cambridge", "Worcester"]
    },
    UK: ["London", "Manchester", "Edinburgh", "Oxford"],
    CAN: ["Toronto", "Vancouver", "Montreal", "Calgary"],
    GER: ["Berlin", "Munich", "Frankfurt", "Hamburg"]
};

// State Variables
let currentStep = 1;
const totalSteps = 3;

// DOM Element Selectors
const countrySelect = document.getElementById("countrySelect");
const stateGroup = document.getElementById("stateGroup");
const stateSelect = document.getElementById("stateSelect");
const cityGroup = document.getElementById("cityGroup");
const citySelect = document.getElementById("citySelect");
const budgetSlider = document.getElementById("budgetSlider");
const budgetValue = document.getElementById("budgetValue");

// --- 1. Dynamic Location Filtering Logic ---
countrySelect.addEventListener("change", function() {
    const country = this.value;
    
    // Reset secondary options
    stateSelect.selectedIndex = 0;
    citySelect.selectedIndex = 0;
    
    if (country === "USA") {
        stateGroup.classList.remove("hidden");
        stateSelect.setAttribute("required", "required");
        cityGroup.classList.add("hidden"); // Hide city until state is selected
        citySelect.removeAttribute("required");
    } else {
        stateGroup.classList.add("hidden");
        stateSelect.removeAttribute("required");
        
        // Directly populate cities for non-USA nations
        populateCities(locationData[country]);
        cityGroup.classList.remove("hidden");
        citySelect.setAttribute("required", "required");
    }
});

stateSelect.addEventListener("change", function() {
    const country = countrySelect.value;
    const state = this.value;
    
    if (country === "USA" && state) {
        populateCities(locationData[country][state]);
        cityGroup.classList.remove("hidden");
        citySelect.setAttribute("required", "required");
    }
});

function populateCities(citiesArray) {
    citySelect.innerHTML = '<option value="" disabled selected>Choose a city / region...</option>';
    citiesArray.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// --- 2. Live Value Tracking for UI Input Controls ---
budgetSlider.addEventListener("input", function() {
    budgetValue.textContent = `$${parseInt(this.value).toLocaleString()}`;
});

// Dynamic Card Highlighting Styling Hook
document.querySelectorAll('.selectable-card input').forEach(input => {
    // Initialize checked card highlights
    if (input.checked) {
        input.closest('.selectable-card').classList.add('selected');
    }

    input.addEventListener('change', function() {
        if (this.type === 'radio') {
            document.querySelectorAll(`input[name="${this.name}"]`).forEach(radio => {
                radio.closest('.selectable-card').classList.remove('selected');
            });
            this.closest('.selectable-card').classList.add('selected');
        } else if (this.type === 'checkbox') {
            if (this.checked) {
                this.closest('.selectable-card').classList.add('selected');
            } else {
                this.closest('.selectable-card').classList.remove('selected');
            }
        }
    });
});

// --- 3. Step Transition Navigation ---
function updateStepUI() {
    // Update Visibility
    document.querySelectorAll(".wizard-step").forEach((step, index) => {
        step.classList.toggle("active", index === (currentStep - 1));
    });

    // Update Progress Indicator String and Bar UI
    document.getElementById("stepIndicator").textContent = `Step ${currentStep} of ${totalSteps}`;
    document.getElementById("progressBar").style.width = `${(currentStep / totalSteps) * 100}%`;
}

function nextStep(stepNumber) {
    // Enforce HTML5 Form validation attributes inside current step container
    const currentStepContainer = document.getElementById(`step${stepNumber}`);
    const valid = [...currentStepContainer.querySelectorAll("select, input")].every(input => {
        return input.reportValidity();
    });

    if (valid && currentStep < totalSteps) {
        currentStep++;
        updateStepUI();
    }
}

function prevStep(stepNumber) {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI();
    }
}

// --- 4. Final Questionnaire Submission Output ---
document.getElementById("wizardForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Gather all user selected form choices
    const formData = new FormData(this);
    const results = {
        country: formData.get("countrySelect"),
        state: formData.get("stateSelect") || "N/A",
        city: formData.get("citySelect"),
        budget: budgetSlider.value,
        schoolType: formData.get("schoolType"),
        interests: formData.getAll("interests"),
        priorities: formData.getAll("priorities")
    };
    console.log(results);
});