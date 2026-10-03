// =========================================
// SKINCARE AI - COMMON JAVASCRIPT
// Page 1, Page 2, Page 3, Page 4 and Page 5
// =========================================


// =========================================
// DOM CONTENT LOADED
// =========================================

document.addEventListener("DOMContentLoaded", function () {


    // =====================================
    // PAGE 1 - LOGIN / REGISTER
    // =====================================

    const loginForm =
        document.getElementById("login");

    const registerForm =
        document.getElementById("register");

    const loginBox =
        document.getElementById("loginForm");

    const registerBox =
        document.getElementById("registerForm");


    // =====================================
    // SHOW REGISTER
    // =====================================

    window.showRegister = function () {

        if (loginBox && registerBox) {

            loginBox.classList.add("hidden");

            registerBox.classList.remove("hidden");

        }

    };


    // =====================================
    // SHOW LOGIN
    // =====================================

    window.showLogin = function () {

        if (loginBox && registerBox) {

            registerBox.classList.add("hidden");

            loginBox.classList.remove("hidden");

        }

    };


    // =====================================
    // PASSWORD SHOW / HIDE
    // =====================================

    window.togglePassword =
        function (inputId, button) {

            const input =
                document.getElementById(inputId);

            if (!input) return;


            if (input.type === "password") {

                input.type = "text";

                if (button) {
                    button.textContent = "🙈";
                }

            } else {

                input.type = "password";

                if (button) {
                    button.textContent = "👁";
                }

            }

        };


    // =====================================
    // LOGIN
    // =====================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById(
                        "loginEmail"
                    );

                const password =
                    document.getElementById(
                        "loginPassword"
                    );


                // Check fields
                if (
                    !email ||
                    !password ||
                    !email.value.trim() ||
                    !password.value.trim()
                ) {

                    alert(
                        "Please fill in all fields."
                    );

                    return;

                }


                // Get registered user
                const savedUser =
                    localStorage.getItem(
                        "userData"
                    );


                if (!savedUser) {

                    alert(
                        "Account not found. Please register first."
                    );

                    return;

                }


                let user;


                try {

                    user =
                        JSON.parse(savedUser);

                } catch (error) {

                    console.error(
                        "User data error:",
                        error
                    );

                    alert(
                        "Account data is invalid. Please register again."
                    );

                    return;

                }


                // Check email
                if (
                    email.value.trim().toLowerCase()
                    !==
                    String(user.email)
                        .trim()
                        .toLowerCase()
                ) {

                    alert(
                        "Incorrect email or password."
                    );

                    return;

                }


                // Check password
                if (
                    password.value !==
                    user.password
                ) {

                    alert(
                        "Incorrect email or password."
                    );

                    return;

                }


                // Login successful
                localStorage.setItem(
                    "loggedInUser",
                    "true"
                );


                alert(
                    "Login successful!"
                );


                // PAGE 1 → PAGE 2
                window.location.href =
                    "image.html";

            }
        );

    }


    // =====================================
    // REGISTER
    // =====================================

    if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "fullName"
                );

            const email =
                document.getElementById(
                    "registerEmail"
                );

            const password =
                document.getElementById(
                    "registerPassword"
                );

            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                );


            // Check fields exist
            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                alert(
                    "Please fill in all fields."
                );

                return;
            }


            // Check empty fields
            if (
                !name.value.trim() ||
                !email.value.trim() ||
                !password.value.trim() ||
                !confirmPassword.value.trim()
            ) {

                alert(
                    "Please fill in all fields."
                );

                return;
            }


            // Name should contain only letters and spaces
            if (
                !/^[A-Za-z\s]+$/.test(
                    name.value.trim()
                )
            ) {

                alert(
                    "Name should contain only letters and spaces."
                );

                return;
            }


            // Password match
            if (
                password.value !==
                confirmPassword.value
            ) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            // Password length
            if (
                password.value.length < 6
            ) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            // Existing account
            const existingUser =
                localStorage.getItem(
                    "userData"
                );


            if (existingUser) {

                try {

                    const oldUser =
                        JSON.parse(
                            existingUser
                        );


                    if (
                        email.value
                            .trim()
                            .toLowerCase()
                        ===
                        String(oldUser.email)
                            .trim()
                            .toLowerCase()
                    ) {

                        alert(
                            "This email is already registered. Please login."
                        );

                        return;
                    }

                } catch (error) {

                    console.error(
                        "Existing user data error:",
                        error
                    );

                }

            }


            // Save account
            const userData = {

                name:
                    name.value.trim(),

                email:
                    email.value.trim(),

                password:
                    password.value

            };


            // Save complete user data permanently
            localStorage.setItem(
                "userData",
                JSON.stringify(userData)
            );


            // Save registered email separately
            localStorage.setItem(
                "registeredEmail",
                email.value.trim()
            );


            // Remove previous login status
            localStorage.removeItem(
                "loggedInUser"
            );


            alert(
                "Account created successfully! Please login."
            );


            showLogin();

        }
    );

}

    // =====================================
    // LOAD USER DATA
    // =====================================

    loadUserDetails();


    // =====================================
    // USER DROPDOWN
    // =====================================

    setupUserDropdown();

// =========================================
// USER FLOATING DROPDOWN
// =========================================

function setupUserDropdown() {

    const userTrigger =
        document.getElementById("userTrigger");

    const userDropdown =
        document.getElementById("userDropdown");

    const userMenu =
        document.getElementById("userMenu");

    if (!userTrigger || !userDropdown) {
        return;
    }


    // USER CLICK
    userTrigger.addEventListener("click", function (event) {

        event.stopPropagation();

        userDropdown.classList.toggle("show");

    });


    // DROPDOWN CLICK
    userDropdown.addEventListener("click", function (event) {

        event.stopPropagation();

    });


    // OUTSIDE CLICK
    document.addEventListener("click", function () {

        userDropdown.classList.remove("show");

    });


    // PROFILE SETTINGS
    const profileBtn =
        document.getElementById("profileSettingsBtn");

    if (profileBtn) {

        profileBtn.addEventListener("click", function () {

            alert("Profile Settings");

        });

    }


    // CHANGE PASSWORD
    const passwordBtn =
        document.getElementById("changePasswordBtn");

    if (passwordBtn) {

        passwordBtn.addEventListener("click", function () {

            alert("Change Password");

        });

    }


    // LOGOUT
    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            localStorage.removeItem("loggedInUser");

            window.location.href = "index.html";

        });

    }

}
    // =====================================
    // LOGOUT
    // =====================================

    setupLogout();


    // =====================================
    // MOBILE SIDEBAR
    // =====================================

    setupMobileMenu();


    // =====================================
    // PAGE 2 - IMAGE UPLOAD
    // =====================================

    setupImageUpload();


    // =====================================
    // PAGE 3 - ANALYSIS
    // =====================================

    setupAnalysisPage();


    // =====================================
    // PAGE 4 - RESULT
    // =====================================

    setupResultPage();


    // =====================================
    // PAGE 5 - HISTORY
    // =====================================

    setupHistoryPage();


    // =====================================
    // CHATBOT
    // =====================================

    setupChatbot();

});


// =====================================================
// USER DETAILS
// =====================================================

function getCurrentUser() {

    const savedUser =
        localStorage.getItem(
            "userData"
        );

    if (!savedUser) {
        return null;
    }


    try {

        return JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

        return null;

    }

}


// =========================================
// LOAD USER DETAILS
// =========================================

function loadUserDetails() {

    const user =
        getCurrentUser();

    if (!user) {
        return;
    }


    const userName =
        user.name || "User";

    const userEmail =
        user.email || "";


    const dropdownUserName =
        document.getElementById(
            "dropdownUserName"
        );


    const dropdownUserEmail =
        document.getElementById(
            "dropdownUserEmail"
        );


    const topUserName =
        document.getElementById(
            "topUserName"
        );


    const headerUserName =
        document.getElementById(
            "headerUserName"
        );


    const sidebarUserName =
        document.getElementById(
            "sidebarUserName"
        );


    if (dropdownUserName) {

        dropdownUserName.textContent =
            userName;

    }


    if (dropdownUserEmail) {

        dropdownUserEmail.textContent =
            userEmail;

    }


    if (topUserName) {

        topUserName.textContent =
            userName;

    }


    if (headerUserName) {

        headerUserName.textContent =
            userName;

    }


    if (sidebarUserName) {

        sidebarUserName.textContent =
            userName;

    }

}


// =====================================================
// USER DROPDOWN
// =====================================================

function setupUserDropdown() {

    const userTrigger =
        document.getElementById(
            "userTrigger"
        );


    const userButton =
        document.getElementById(
            "userButton"
        );


    const userDropdown =
        document.getElementById(
            "userDropdown"
        );


    const trigger =
        userTrigger || userButton;


    if (
        !trigger ||
        !userDropdown
    ) {

        return;

    }


    trigger.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            userDropdown.classList.toggle(
                "show"
            );

        }
    );


    userDropdown.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );


    document.addEventListener(
        "click",
        function () {

            userDropdown.classList.remove(
                "show"
            );

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "loggedInUser"
            );


            localStorage.removeItem(
                "selectedResult"
            );


            window.location.href =
                "index.html";

        }
    );

}


// Also available for HTML onclick
window.logoutUser =
    function () {

        localStorage.removeItem(
            "loggedInUser"
        );

        localStorage.removeItem(
            "selectedResult"
        );

        window.location.href =
            "index.html";

    };


// =====================================================
// PROFILE SETTINGS
// =====================================================

window.openProfileSettings =
    function () {

        alert(
            "Profile Settings will be available soon."
        );

    };


// =====================================================
// CHANGE PASSWORD
// =====================================================

window.changePassword =
    function () {

        const user =
            getCurrentUser();


        if (!user) {

            alert(
                "User information not found."
            );

            return;

        }


        const currentPassword =
            prompt(
                "Enter your current password:"
            );


        if (currentPassword === null) {
            return;
        }


        if (
            currentPassword !==
            user.password
        ) {

            alert(
                "Current password is incorrect."
            );

            return;

        }


        const newPassword =
            prompt(
                "Enter your new password:"
            );


        if (newPassword === null) {
            return;
        }


        if (
            newPassword.length < 6
        ) {

            alert(
                "New password must contain at least 6 characters."
            );

            return;

        }


        const confirmPassword =
            prompt(
                "Confirm your new password:"
            );


        if (confirmPassword === null) {
            return;
        }


        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "New passwords do not match."
            );

            return;

        }


        user.password =
            newPassword;


        localStorage.setItem(
            "userData",
            JSON.stringify(user)
        );


        alert(
            "Password changed successfully!"
        );

    };


// =====================================================
// PAGE 2 - IMAGE UPLOAD
// =====================================================

function setupImageUpload() {

    const imageInput =
        document.getElementById(
            "imageInput"
        );


    if (!imageInput) {
        return;
    }


    const dropZone =
        document.getElementById(
            "dropZone"
        );


    const previewImage =
        document.getElementById(
            "previewImage"
        );


    const emptyPreview =
        document.getElementById(
            "emptyPreview"
        );


    const analyzeButton =
        document.getElementById(
            "analyzeButton"
        );


    function handleImage(file) {

        if (!file) {
            return;
        }


        // Check image
        if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png" &&
            file.type !== "image/jpg"
        ) {

            alert(
                "Please upload a JPG or PNG image."
            );

            return;

        }


        // Check size
        const maxSize =
            5 * 1024 * 1024;


        if (file.size > maxSize) {

            alert(
                "Image size must be less than 5MB."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                if (previewImage) {

                    previewImage.src =
                        event.target.result;

                    previewImage.style.display =
                        "block";

                }


                if (emptyPreview) {

                    emptyPreview.style.display =
                        "none";

                }


                if (analyzeButton) {

                    analyzeButton.disabled =
                        false;

                }


                // Save image
                localStorage.setItem(
                    "skinImage",
                    event.target.result
                );

            };


        reader.readAsDataURL(file);

    }


    // File selection
    imageInput.addEventListener(
        "change",
        function () {

            handleImage(
                this.files[0]
            );

        }
    );


    // Drag and drop
    if (dropZone) {

        dropZone.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                dropZone.classList.add(
                    "dragging"
                );

            }
        );


        dropZone.addEventListener(
            "dragleave",
            function () {

                dropZone.classList.remove(
                    "dragging"
                );

            }
        );


        dropZone.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();

                dropZone.classList.remove(
                    "dragging"
                );


                const file =
                    event.dataTransfer.files[0];


                handleImage(file);

            }
        );

    }


    // Analyze button
    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            function () {

                const file =
                    imageInput.files[0];


                if (!file) {

                    alert(
                        "Please select an image first."
                    );

                    return;

                }


                const formData =
                    new FormData();


                formData.append(
                    "image",
                    file
                );


                analyzeButton.disabled =
                    true;


                analyzeButton.textContent =
                    "Uploading...";


                fetch(
                    "http://127.0.0.1:5000/upload",
                    {
                        method: "POST",
                        body: formData
                    }
                )
                .then(
                    function (response) {

                        if (!response.ok) {

                            throw new Error(
                                "Server error: " +
                                response.status
                            );

                        }


                        return response.json();

                    }
                )
                .then(
                    function (data) {

                        console.log(
                            "Backend response:",
                            data
                        );


                        // Save backend response
                        localStorage.setItem(
                            "backendResult",
                            JSON.stringify(data)
                        );


                        if (data.error) {

                            alert(
                                data.error
                            );


                            analyzeButton.disabled =
                                false;


                            analyzeButton.textContent =
                                "Analyze Image";


                            return;

                        }


                        // PAGE 2 → PAGE 3
                        window.location.href =
                            "analysis.html";

                    }
                )
                .catch(
                    function (error) {

                        console.error(
                            "Upload error:",
                            error
                        );


                        alert(
                            "Backend connection failed. Please make sure Flask is running."
                        );


                        analyzeButton.disabled =
                            false;


                        analyzeButton.textContent =
                            "Analyze Image";

                    }
                );

            }
        );

    }

}


// =====================================================
// PAGE 3 - ANALYSIS
// =====================================================

function setupAnalysisPage() {

    const analysisPage =
        document.querySelector(
            ".analysis-page"
        );


    if (!analysisPage) {
        return;
    }


    const steps =
        document.querySelectorAll(
            ".process-step"
        );


    if (!steps.length) {

        setTimeout(
            function () {

                window.location.href =
                    "result.html";

            },
            2000
        );

        return;

    }


    let currentStep = 0;


    // First step
    steps[0].classList.add(
        "current"
    );


    const analysisTimer =
        setInterval(
            function () {

                // Complete current step
                if (currentStep < steps.length) {

                    steps[currentStep]
                        .classList.remove(
                            "current"
                        );


                    steps[currentStep]
                        .classList.add(
                            "completed"
                        );


                    const icon =
                        steps[currentStep]
                            .querySelector(
                                ".step-icon"
                            );


                    if (icon) {

                        icon.textContent =
                            "✓";

                    }

                }


                currentStep++;


                // Next step
                if (
                    currentStep <
                    steps.length
                ) {

                    steps[currentStep]
                        .classList.add(
                            "current"
                        );

                }


                // Finished
                if (
                    currentStep >=
                    steps.length
                ) {

                    clearInterval(
                        analysisTimer
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "result.html";

                        },
                        1000
                    );

                }

            },
            1200
        );

}


// =====================================================
// PAGE 4 - RESULT
// =====================================================

function setupResultPage() {

    const classificationElement =
        document.getElementById(
            "classification"
        );


    if (!classificationElement) {
        return;
    }


    loadResult();

}


// =====================================================
// LOAD RESULT
// =====================================================

function loadResult() {

    let data = null;


    // First try backend result
    const backendResult =
        localStorage.getItem(
            "backendResult"
        );


    if (backendResult) {

        try {

            const backendData =
                JSON.parse(
                    backendResult
                );


            data =
                convertBackendResult(
                    backendData
                );

        } catch (error) {

            console.error(
                "Backend result error:",
                error
            );

        }

    }


    // If history result selected
    const selectedResult =
        localStorage.getItem(
            "selectedResult"
        );


    if (selectedResult) {

        try {

            const selected =
                JSON.parse(
                    selectedResult
                );


            if (selected) {

                data = {

                    classification:
                        selected.classification ||
                        "Unknown",

                    confidence:
                        Number(
                            selected.confidence
                        ) || 0,

                    predictions:
                        selected.predictions ||
                        {
                            Nevus: 0,
                            Melanoma: 0,
                            BCC: 0,
                            Others: 0
                        }

                };

            }

        } catch (error) {

            console.error(
                "Selected result error:",
                error
            );

        }

    }


    // Temporary demo result
    if (!data) {

        data = {

            classification:
                "Nevus",

            confidence:
                92,

            predictions: {

                Nevus: 92,

                Melanoma: 5,

                BCC: 2,

                Others: 1

            }

        };

    }


    // Display result
    updateResultPage(data);


    // Save result to history
    saveAnalysisToHistory(data);


    // Clear selected result
    localStorage.removeItem(
        "selectedResult"
    );

}


// =====================================================
// CONVERT BACKEND RESULT
// =====================================================

function convertBackendResult(data) {

    const classification =
        data.classification ||
        data.prediction ||
        data.label ||
        "Unknown";


    const confidence =
        Number(
            data.confidence
        ) || 0;


    const predictions =
        data.predictions ||
        data.probabilities ||
        {

            Nevus:
                classification === "Nevus"
                    ? confidence
                    : 0,

            Melanoma:
                classification === "Melanoma"
                    ? confidence
                    : 0,

            BCC:
                classification === "BCC"
                    ? confidence
                    : 0,

            Others:
                classification === "Others"
                    ? confidence
                    : 0

        };


    return {

        classification:
            classification,

        confidence:
            confidence,

        predictions:
            predictions

    };

}


// =====================================================
// UPDATE RESULT PAGE
// =====================================================

function updateResultPage(data) {

    const classification =
        data.classification ||
        "Unknown";


    const confidence =
        Number(
            data.confidence
        ) || 0;


    const predictions =
        data.predictions ||
        {

            Nevus: 0,

            Melanoma: 0,

            BCC: 0,

            Others: 0

        };


    // Classification
    const classificationElement =
        document.getElementById(
            "classification"
        );


    if (classificationElement) {

        classificationElement.textContent =
            classification;

    }


    // Confidence
    const confidenceElement =
        document.getElementById(
            "confidence"
        );


    if (confidenceElement) {

        confidenceElement.textContent =
            confidence + "%";

    }


    // Main progress
    const mainProgress =
        document.getElementById(
            "mainProgress"
        );


    if (mainProgress) {

        mainProgress.style.width =
            confidence + "%";

    }


    // Prediction bars
    updatePrediction(
        "Nevus",
        predictions.Nevus || 0
    );


    updatePrediction(
        "Melanoma",
        predictions.Melanoma || 0
    );


    updatePrediction(
        "BCC",
        predictions.BCC || 0
    );


    updatePrediction(
        "Others",
        predictions.Others || 0
    );


    // Risk
    updateRiskIndicator(
        classification
    );


    // Information
    updateGeneralInformation(
        classification
    );

}


// =====================================================
// UPDATE PREDICTION
// =====================================================

function updatePrediction(
    name,
    value
) {

    const bar =
        document.getElementById(
            "bar" + name
        );


    const valueText =
        document.getElementById(
            "value" + name
        );


    if (bar) {

        bar.style.width =
            Number(value) + "%";

    }


    if (valueText) {

        valueText.textContent =
            Number(value) + "%";

    }

}


// =====================================================
// RISK INDICATOR
// =====================================================

function updateRiskIndicator(
    classification
) {

    const badge =
        document.getElementById(
            "riskBadge"
        );


    if (!badge) {
        return;
    }


    if (
        String(classification)
            .toLowerCase()
            ===
            "melanoma"
    ) {

        badge.textContent =
            "⚠ Higher Model-Risk Output";


        badge.className =
            "risk-badge high";

    } else {

        badge.textContent =
            "✓ Lower Model-Risk Output";


        badge.className =
            "risk-badge low";

    }

}


// =====================================================
// GENERAL INFORMATION
// =====================================================

function updateGeneralInformation(
    classification
) {

    const info =
        document.getElementById(
            "generalInformation"
        );


    if (!info) {
        return;
    }


    const information = {

        Nevus:
            "Nevus is a common type of mole. Changes in size, shape, color or texture should be evaluated by a qualified professional.",


        Melanoma:
            "Melanoma is a type of skin cancer. An AI prediction cannot confirm a diagnosis, so professional medical evaluation is important.",


        BCC:
            "Basal cell carcinoma is a type of skin cancer. A model prediction should be reviewed by a qualified healthcare professional.",


        Others:
            "The model classified this image under the Others category. Professional evaluation may be appropriate if there are concerning changes."

    };


    info.textContent =
        information[classification]
        ||
        "Please consult a qualified healthcare professional for further evaluation.";

}


// =====================================================
// SAVE RESULT TO HISTORY
// =====================================================

function saveAnalysisToHistory(
    result
) {

    const user =
        getCurrentUser();


    if (!user || !user.email) {

        console.warn(
            "User not found. History not saved."
        );

        return;

    }


    const historyKey =
        "history_" +
        user.email
            .toLowerCase()
            .trim();


    let history = [];


    const savedHistory =
        localStorage.getItem(
            historyKey
        );


    if (savedHistory) {

        try {

            history =
                JSON.parse(
                    savedHistory
                );


            if (!Array.isArray(history)) {

                history = [];

            }

        } catch (error) {

            history = [];

        }

    }


    const now =
        new Date();


    const historyItem = {

        id:
            Date.now(),

        image:
            localStorage.getItem(
                "skinImage"
            ) || "",

        classification:
            result.classification ||
            "Unknown",

        confidence:
            Number(
                result.confidence
            ) || 0,

        predictions:
            result.predictions ||
            {},

        risk:
            getRiskFromClassification(
                result.classification
            ),

        date:
            now.toLocaleDateString(
                "en-GB"
            ),

        time:
            now.toLocaleTimeString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        createdAt:
            now.toISOString()

    };


    history.push(
        historyItem
    );


    localStorage.setItem(
        historyKey,
        JSON.stringify(history)
    );


    console.log(
        "Result saved to history."
    );

}


// =====================================================
// GET RISK
// =====================================================

function getRiskFromClassification(
    classification
) {

    if (
        String(classification)
            .toLowerCase()
            ===
            "melanoma"
    ) {

        return "High";

    }


    if (
        String(classification)
            .toLowerCase()
            ===
            "bcc"
    ) {

        return "Medium";

    }


    return "Low";

}


// =====================================================
// ANALYZE ANOTHER IMAGE
// =====================================================

window.analyzeAnotherImage =
    function () {

        localStorage.removeItem(
            "selectedResult"
        );


        localStorage.removeItem(
            "backendResult"
        );


        window.location.href =
            "image.html";

    };


// =====================================================
// PDF REPORT
// =====================================================

window.downloadPDF =
    function () {

        window.print();

    };


// =====================================================
// PAGE 5 - HISTORY
// =====================================================

function setupHistoryPage() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (!historyList) {
        return;
    }


    displayHistoryPage();


    // Search
    const historySearch =
        document.getElementById(
            "historySearch"
        );


    if (historySearch) {

        historySearch.addEventListener(
            "input",
            function () {

                filterHistory();

            }
        );

    }


    // Risk filter
    const riskFilter =
        document.getElementById(
            "riskFilter"
        );


    if (riskFilter) {

        riskFilter.addEventListener(
            "change",
            function () {

                filterHistory();

            }
        );

    }

}


// =====================================================
// GET USER HISTORY
// =====================================================

function getUserHistory() {

    const user =
        getCurrentUser();


    if (!user || !user.email) {

        return [];

    }


    const historyKey =
        "history_" +
        user.email
            .toLowerCase()
            .trim();


    const saved =
        localStorage.getItem(
            historyKey
        );


    if (!saved) {

        return [];

    }


    try {

        const history =
            JSON.parse(
                saved
            );


        return Array.isArray(history)
            ? history
            : [];

    } catch (error) {

        return [];

    }

}


// =====================================================
// DISPLAY HISTORY
// =====================================================

function displayHistoryPage() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    const noHistory =
        document.getElementById(
            "noHistory"
        );


    if (!historyList) {
        return;
    }


    let history =
        getUserHistory();


    historyList.innerHTML =
        "";


    if (!history.length) {

        if (noHistory) {

            noHistory.style.display =
                "block";

        }

        return;

    }


    if (noHistory) {

        noHistory.style.display =
            "none";

    }


    // Newest first
    history =
        [...history].reverse();


    history.forEach(
        function (item) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "history-card";


            card.setAttribute(
                "data-classification",
                String(
                    item.classification ||
                    ""
                ).toLowerCase()
            );


            card.setAttribute(
                "data-risk",
                String(
                    item.risk ||
                    ""
                ).toLowerCase()
            );


            card.innerHTML = `

                <div class="history-image">

                    <img
                        src="${item.image || 'https://via.placeholder.com/150'}"
                        alt="Skin Analysis"
                    >

                </div>


                <div class="history-details">

                    <h3>
                        ${item.classification || "Unknown"}
                    </h3>


                    <p class="history-confidence">

                        Confidence:
                        <strong>
                            ${item.confidence || 0}%
                        </strong>

                    </p>


                    <p class="history-risk">

                        <span
                            class="risk-dot ${getRiskClass(item.risk)}">
                        </span>

                        ${item.risk || "Unknown"} Risk

                    </p>


                    <div class="history-date">

                        📅 ${item.date || ""}
                        &nbsp;&nbsp;
                        🕐 ${item.time || ""}

                    </div>

                </div>


                <div class="history-actions">

                    <button
                        class="view-result"
                        onclick="viewHistoryResult('${item.id}')">

                        View Result

                    </button>


                    <button
                        class="download-btn"
                        onclick="downloadHistoryPDF('${item.id}')">

                        Download

                    </button>

                </div>

            `;


            historyList.appendChild(
                card
            );

        }
    );


    filterHistory();

}


// =====================================================
// RISK CLASS
// =====================================================

function getRiskClass(
    risk
) {

    if (!risk) {
        return "";
    }


    return String(risk)
        .toLowerCase()
        .replace(" risk", "")
        .trim();

}


// =====================================================
// FILTER HISTORY
// =====================================================

function filterHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (!historyList) {
        return;
    }


    const searchInput =
        document.getElementById(
            "historySearch"
        );


    const riskFilter =
        document.getElementById(
            "riskFilter"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedRisk =
        riskFilter
            ? riskFilter.value.toLowerCase()
            : "all";


    const cards =
        historyList.querySelectorAll(
            ".history-card"
        );


    cards.forEach(
        function (card) {

            const cardText =
                card.innerText.toLowerCase();


            const cardRisk =
                card.getAttribute(
                    "data-risk"
                ) || "";


            const searchMatch =
                cardText.includes(
                    searchText
                );


            const riskMatch =
                selectedRisk === "all" ||
                cardRisk === selectedRisk;


            if (
                searchMatch &&
                riskMatch
            ) {

                card.style.display =
                    "flex";

            } else {

                card.style.display =
                    "none";

            }

        }
    );

}


// =====================================================
// VIEW HISTORY RESULT
// =====================================================

window.viewHistoryResult =
    function (historyId) {

        const history =
            getUserHistory();


        const selected =
            history.find(
                function (item) {

                    return String(item.id) ===
                        String(historyId);

                }
            );


        if (!selected) {

            alert(
                "Result not found."
            );

            return;

        }


        localStorage.setItem(
            "selectedResult",
            JSON.stringify(
                selected
            )
        );


        // Go result page
        window.location.href =
            "result.html";

    };


// =====================================================
// DOWNLOAD HISTORY PDF
// =====================================================

window.downloadHistoryPDF =
    function (historyId) {

        const history =
            getUserHistory();


        const selected =
            history.find(
                function (item) {

                    return String(item.id) ===
                        String(historyId);

                }
            );


        if (!selected) {

            alert(
                "Result not found."
            );

            return;

        }


        localStorage.setItem(
            "selectedResult",
            JSON.stringify(
                selected
            )
        );


        window.print();

    };


// =====================================================
// MOBILE SIDEBAR
// =====================================================

function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            "menuButton"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        ) ||
        document.querySelector(
            ".sidebar"
        );


    if (
        !menuButton ||
        !sidebar
    ) {

        return;

    }


    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );


            sidebar.classList.toggle(
                "show"
            );

        }
    );

}


// =====================================================
// CHATBOT - GEMINI AI
// =====================================================

function setupChatbot() {

    const chatbotButton =
        document.getElementById("chatbotButton");

    const chatbot =
        document.getElementById("chatbot");

    const closeChat =
        document.getElementById("closeChat");

    const sendMessage =
        document.getElementById("sendMessage");

    const chatInput =
        document.getElementById("chatInput");

    const chatBody =
        document.querySelector(".chat-body");


    // =========================================
    // OPEN CHATBOT
    // =========================================

    if (chatbotButton && chatbot) {

        chatbotButton.addEventListener(
            "click",
            function () {

                chatbot.classList.add("open");

            }
        );

    }


    // =========================================
    // CLOSE CHATBOT
    // =========================================

    if (closeChat && chatbot) {

        closeChat.addEventListener(
            "click",
            function () {

                chatbot.classList.remove("open");

            }
        );

    }


    // =========================================
    // SEND CHAT MESSAGE
    // =========================================

    async function sendChatMessage() {

        if (!chatInput || !chatBody) {
            return;
        }


        const message =
            chatInput.value.trim();


        if (!message) {
            return;
        }


        // =====================================
        // USER MESSAGE
        // =====================================

        const userMessage =
            document.createElement("div");


        userMessage.className =
            "user-message";


        userMessage.textContent =
            message;


        chatBody.appendChild(
            userMessage
        );


        // Clear input

        chatInput.value = "";


        chatBody.scrollTop =
            chatBody.scrollHeight;


        // =====================================
        // THINKING MESSAGE
        // =====================================

        const loadingMessage =
            document.createElement("div");


        loadingMessage.className =
            "bot-message";


        loadingMessage.textContent =
            "Thinking...";


        chatBody.appendChild(
            loadingMessage
        );


        chatBody.scrollTop =
            chatBody.scrollHeight;


        // =====================================
        // GEMINI BACKEND REQUEST
        // =====================================

        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            message: message
                        })
                    }
                );


            // Check server response

            if (!response.ok) {

                throw new Error(
                    "Server error: " +
                    response.status
                );

            }


            const data =
                await response.json();


            // Remove Thinking...

            loadingMessage.remove();


            // =================================
            // BOT RESPONSE
            // =================================

            const botMessage =
                document.createElement("div");


            botMessage.className =
                "bot-message";


            if (data.error) {

                botMessage.textContent =
                    "Sorry, something went wrong. Please try again.";

            } else {

                botMessage.textContent =
                    data.reply ||
                    "Sorry, I couldn't generate a response.";

            }


            chatBody.appendChild(
                botMessage
            );


            chatBody.scrollTop =
                chatBody.scrollHeight;


        } catch (error) {

            console.error(
                "Chat error:",
                error
            );


            loadingMessage.textContent =
                "Sorry, I couldn't connect to the AI. Please make sure Flask is running.";


            chatBody.scrollTop =
                chatBody.scrollHeight;

        }

    }


    // =========================================
    // SEND BUTTON
    // =========================================

    if (sendMessage) {

        sendMessage.addEventListener(
            "click",
            sendChatMessage
        );

    }


    // =========================================
    // ENTER KEY
    // =========================================

    if (chatInput) {

        chatInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    sendChatMessage();

                }

            }
        );

    }

}


// =====================================================
// SKINGUARD AI
// =====================================================

window.openChatbot =
    function () {

        const chatbot =
            document.getElementById("chatbot");


        if (chatbot) {

            chatbot.classList.add("open");

        }

    };

    // =========================================
// INFORMATION POPUPS
// =========================================

function setupInformationPopups() {
    function setupInformationPanels() {

    const generalBtn =
        document.getElementById("generalInfoBtn");

    const preventionBtn =
        document.getElementById("preventionBtn");

    const generalPanel =
        document.getElementById("generalInfoPanel");

    const preventionPanel =
        document.getElementById("preventionPanel");

    const closeGeneral =
        document.getElementById("closeGeneralInfo");

    const closePrevention =
        document.getElementById("closePrevention");


    // GENERAL INFORMATION

    if (generalBtn && generalPanel) {

        generalBtn.addEventListener("click", function () {

            preventionPanel.classList.remove("show");

            generalPanel.classList.toggle("show");

        });

    }


    // PREVENTIVE MEASURES

    if (preventionBtn && preventionPanel) {

        preventionBtn.addEventListener("click", function () {

            generalPanel.classList.remove("show");

            preventionPanel.classList.toggle("show");

        });

    }


    // CLOSE GENERAL

    if (closeGeneral) {

        closeGeneral.addEventListener("click", function () {

            generalPanel.classList.remove("show");

        });

    }


    // CLOSE PREVENTION

    if (closePrevention) {

        closePrevention.addEventListener("click", function () {

            preventionPanel.classList.remove("show");

        });

    }

}

    const generalInfoBtn =
        document.getElementById("generalInfoBtn");

    const preventionBtn =
        document.getElementById("preventionBtn");

    const generalInfoModal =
        document.getElementById("generalInfoModal");

    const preventionModal =
        document.getElementById("preventionModal");

    const closeGeneralInfo =
        document.getElementById("closeGeneralInfo");

    const closePrevention =
        document.getElementById("closePrevention");


    // General Information
    if (generalInfoBtn && generalInfoModal) {

        generalInfoBtn.addEventListener("click", function () {

            generalInfoModal.classList.add("show");

        });

    }


    // Preventive Measures
    if (preventionBtn && preventionModal) {

        preventionBtn.addEventListener("click", function () {

            preventionModal.classList.add("show");

        });

    }


    // Close General Information
    if (closeGeneralInfo) {

        closeGeneralInfo.addEventListener("click", function () {

            generalInfoModal.classList.remove("show");

        });

    }


    // Close Preventive Measures
    if (closePrevention) {

        closePrevention.addEventListener("click", function () {

            preventionModal.classList.remove("show");

        });

    }


    // Click outside popup
    [generalInfoModal, preventionModal].forEach(function (modal) {

        if (modal) {

            modal.addEventListener("click", function (event) {

                if (event.target === modal) {

                    modal.classList.remove("show");

                }

            });

        }

    });

}
// =====================================================
// DERmaSCAN AI
// PROFESSIONAL PDF REPORT
// =====================================================

async function downloadPDF() {

    try {

        if (!window.jspdf) {
            alert("PDF system loading. Please try again.");
            return;
        }

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        // =========================================
        // USER DETAILS
        // =========================================

        let userName = "User";
        let userEmail = "user@gmail.com";

        const savedUser =
            localStorage.getItem("userData");

        if (savedUser) {

            try {

                const user =
                    JSON.parse(savedUser);

                userName =
                    user.fullName ||
                    user.name ||
                    "User";

                userEmail =
                    user.email ||
                    "user@gmail.com";

            } catch (error) {

                console.log("User data error:", error);

            }
        }

        // =========================================
        // DATE & TIME
        // =========================================

        const now = new Date();

        const dateText =
            now.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

        const timeText =
            now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
            });

        // =========================================
        // RESULT VALUES
        // =========================================

        function getText(id, fallback = "") {

            const element =
                document.getElementById(id);

            return element
                ? element.textContent.trim()
                : fallback;
        }

        const classification =
            getText("classification", "Unknown");

        const confidence =
            getText("confidence", "0%");

        const risk =
            getText("riskBadge", "Unknown")
                .replace("🛡️", "")
                .trim();

        const nevus =
            getText("valueNevus", "0%");

        const melanoma =
            getText("valueMelanoma", "0%");

        const bcc =
            getText("valueBCC", "0%");

        const others =
            getText("valueOthers", "0%");

        // =========================================
        // GENERAL INFORMATION
        // ONLY GENERAL INFORMATION
        // =========================================

        const generalCard =
            document.getElementById(
                "generalInfoCard"
            );

        let generalInfo =
            "General information is not available.";

        if (generalCard) {

            generalInfo =
                generalCard.innerText
                    .replace("×", "")
                    .trim();

        }

        // =========================================
        // SKIN IMAGE
        // =========================================

        const skinImage =
            localStorage.getItem("skinImage");

        // =========================================
        // PAGE BACKGROUND
        // =========================================

        pdf.setFillColor(
            255,
            255,
            255
        );

        pdf.rect(
            0,
            0,
            210,
            297,
            "F"
        );

        // =========================================
        // HEADER
        // =========================================

        pdf.setFillColor(
            235,
            247,
            255
        );

        pdf.rect(
            0,
            0,
            210,
            32,
            "F"
        );

        // Logo circle

        pdf.setFillColor(
            25,
            150,
            190
        );

        pdf.circle(
            22,
            16,
            7,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(21);

        pdf.setTextColor(
            15,
            75,
            125
        );

        pdf.text(
            "DermaScan AI",
            34,
            15
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(9);

        pdf.setTextColor(
            80,
            105,
            120
        );

        pdf.text(
            "AI-Based Skin Analysis System",
            34,
            22
        );

        // Date & time

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(8);

        pdf.setTextColor(
            110,
            130,
            145
        );

        pdf.text(
            "Date & Time",
            140,
            11
        );

        pdf.setFontSize(10);

        pdf.setTextColor(
            40,
            65,
            85
        );

        pdf.text(
            `${dateText}  |  ${timeText}`,
            140,
            19
        );

        // =========================================
        // TITLE
        // =========================================

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(22);

        pdf.setTextColor(
            15,
            70,
            115
        );

        pdf.text(
            "Skin Analysis Report",
            12,
            46
        );

        pdf.setDrawColor(
            20,
            145,
            190
        );

        pdf.setLineWidth(1);

        pdf.line(
            12,
            51,
            42,
            51
        );

        // =========================================
        // USER INFORMATION CARD
        // =========================================

        pdf.setFillColor(
            240,
            248,
            255
        );

        pdf.roundedRect(
            12,
            58,
            103,
            48,
            4,
            4,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(12);

        pdf.setTextColor(
            15,
            80,
            125
        );

        pdf.text(
            "Patient / User Information",
            20,
            69
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(9);

        pdf.setTextColor(
            65,
            80,
            95
        );

        pdf.text(
            "Name",
            20,
            80
        );

        pdf.text(
            userName,
            50,
            80
        );

        pdf.text(
            "Email",
            20,
            89
        );

        pdf.text(
            userEmail,
            50,
            89
        );

        pdf.text(
            "Analysis Date",
            20,
            98
        );

        pdf.text(
            `${dateText}  |  ${timeText}`,
            50,
            98
        );

        // =========================================
        // IMAGE CARD
        // =========================================

        pdf.setFillColor(
            240,
            248,
            255
        );

        pdf.roundedRect(
            119,
            58,
            79,
            48,
            4,
            4,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(11);

        pdf.setTextColor(
            15,
            80,
            125
        );

        pdf.text(
            "Uploaded Skin Image",
            125,
            69
        );

        if (skinImage) {

            try {

                let format = "JPEG";

                if (
                    skinImage.startsWith(
                        "data:image/png"
                    )
                ) {
                    format = "PNG";
                }

                pdf.addImage(
                    skinImage,
                    format,
                    125,
                    73,
                    67,
                    27,
                    undefined,
                    "FAST"
                );

            } catch (error) {

                console.log(
                    "Image error:",
                    error
                );

            }
        }

        // =========================================
        // CLASSIFICATION CARD
        // =========================================

        pdf.setFillColor(
            235,
            250,
            243
        );

        pdf.roundedRect(
            12,
            113,
            103,
            40,
            4,
            4,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(12);

        pdf.setTextColor(
            15,
            90,
            80
        );

        pdf.text(
            "Classification Result",
            20,
            125
        );

        pdf.setFontSize(18);

        pdf.text(
            classification,
            20,
            139
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(10);

        pdf.text(
            `Confidence: ${confidence}`,
            20,
            147
        );

        // =========================================
        // RISK CARD
        // =========================================

        pdf.setFillColor(
            240,
            248,
            255
        );

        pdf.roundedRect(
            119,
            113,
            79,
            40,
            4,
            4,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(11);

        pdf.setTextColor(
            15,
            80,
            125
        );

        pdf.text(
            "Risk Indicator",
            126,
            125
        );

        pdf.setFontSize(14);

        pdf.setTextColor(
            30,
            140,
            100
        );

        pdf.text(
            risk,
            126,
            139
        );

        // =========================================
        // MODEL OUTPUT
        // =========================================

        pdf.setFillColor(
            250,
            253,
            255
        );

        pdf.roundedRect(
            12,
            160,
            118,
            72,
            4,
            4,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(13);

        pdf.setTextColor(
            15,
            80,
            125
        );

        pdf.text(
            "Model Output",
            20,
            172
        );

        // Header

        pdf.setFillColor(
            225,
            242,
            252
        );

        pdf.rect(
            18,
            178,
            106,
            9,
            "F"
        );

        pdf.setFontSize(9);

        pdf.setTextColor(
            40,
            65,
            80
        );

        pdf.text(
            "Classification",
            22,
            184
        );

        pdf.text(
            "Probability",
            67,
            184
        );

        const rows = [
            ["Nevus", nevus],
            ["Melanoma", melanoma],
            ["BCC", bcc],
            ["Others", others]
        ];

        let y = 194;

        rows.forEach(function(row) {

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(9);

            pdf.setTextColor(
                55,
                70,
                85
            );

            pdf.text(
                row[0],
                22,
                y
            );

            pdf.text(
                row[1],
                67,
                y
            );

            // Progress bar background

            pdf.setFillColor(
                225,
                232,
                238
            );

            pdf.roundedRect(
                82,
                y - 4,
                39,
                4,
                2,
                2,
                "F"
            );

            const percentage =
                parseFloat(
                    row[1]
                ) || 0;

            const barWidth =
                Math.min(
                    39,
                    39 * percentage / 100
                );

            if (barWidth > 0) {

                pdf.setFillColor(
                    45,
                    185,
                    130
                );

                pdf.roundedRect(
                    82,
                    y - 4,
                    barWidth,
                    4,
                    2,
                    2,
                    "F"
                );
            }

            y += 10;
        });

        // =========================================
        // RISK DETAILS
        // =========================================

        pdf.setFillColor(
            240,
            248,
            255
        );

        pdf.roundedRect(
            134,
            160,
            64,
            72,
            4,
            4,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(12);

        pdf.setTextColor(
            15,
            80,
            125
        );

        pdf.text(
            "Risk Indicator",
            141,
            172
        );

        pdf.setFillColor(
            230,
            248,
            238
        );

        pdf.roundedRect(
            140,
            179,
            52,
            40,
            4,
            4,
            "F"
        );

        pdf.setFontSize(14);

        pdf.setTextColor(
            30,
            130,
            90
        );

        pdf.text(
            risk,
            144,
            191
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(8);

        pdf.setTextColor(
            65,
            80,
            90
        );

        const riskText =
            "The detected result should be monitored and reviewed with a qualified healthcare professional when necessary.";

        const riskLines =
            pdf.splitTextToSize(
                riskText,
                45
            );

        pdf.text(
            riskLines,
            144,
            199
        );

        // =========================================
        // IMPORTANT
        // =========================================

        pdf.setFillColor(
            238,
            248,
            255
        );

        pdf.roundedRect(
            12,
            239,
            186,
            31,
            4,
            4,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(12);

        pdf.setTextColor(
            15,
            90,
            135
        );

        pdf.text(
            "Important",
            20,
            250
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(8.5);

        pdf.setTextColor(
            65,
            75,
            85
        );

        const importantText =
            "This report is generated by an AI model and is NOT a final medical diagnosis. Please consult a qualified doctor or dermatologist for proper evaluation and treatment.";

        const importantLines =
            pdf.splitTextToSize(
                importantText,
                166
            );

        pdf.text(
            importantLines,
            20,
            258
        );

        // =========================================
        // GENERAL INFORMATION
        // =========================================

        pdf.addPage();

        pdf.setFillColor(
            235,
            247,
            255
        );

        pdf.rect(
            0,
            0,
            210,
            30,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(20);

        pdf.setTextColor(
            15,
            75,
            125
        );

        pdf.text(
            "DermaScan AI",
            15,
            15
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(9);

        pdf.setTextColor(
            80,
            105,
            120
        );

        pdf.text(
            "General Information",
            15,
            22
        );

        // Title

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(21);

        pdf.setTextColor(
            15,
            70,
            115
        );

        pdf.text(
            "General Information",
            15,
            48
        );

        pdf.setDrawColor(
            20,
            145,
            190
        );

        pdf.line(
            15,
            53,
            50,
            53
        );

        // Content box

        pdf.setFillColor(
            247,
            252,
            255
        );

        pdf.roundedRect(
            15,
            62,
            180,
            180,
            5,
            5,
            "F"
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(10);

        pdf.setTextColor(
            60,
            70,
            80
        );

        const cleanInfo =
            generalInfo
                .replace(
                    /general information/gi,
                    ""
                )
                .trim();

        const infoLines =
            pdf.splitTextToSize(
                cleanInfo ||
                "General information is not available.",
                155
            );

        pdf.text(
            infoLines,
            27,
            77
        );

        // =========================================
        // FOOTER
        // =========================================

        const totalPages =
            pdf.internal.getNumberOfPages();

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            pdf.setPage(page);

            pdf.setDrawColor(
                200,
                220,
                230
            );

            pdf.line(
                15,
                282,
                195,
                282
            );

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(8);

            pdf.setTextColor(
                100,
                115,
                125
            );

            pdf.text(
                "DermaScan AI | AI-Based Skin Analysis System",
                15,
                289
            );

            pdf.text(
                `Page ${page} of ${totalPages}`,
                165,
                289
            );
        }

        // =========================================
        // DOWNLOAD
        // =========================================

        const safeName =
            userName
                .replace(
                    /[^a-z0-9]/gi,
                    "_"
                )
                .substring(0, 30);

        const safeDate =
            dateText
                .replace(/\s+/g, "_")
                .replace(/,/g, "");

        pdf.save(
            `DermaScan_AI_Report_${safeName}_${safeDate}.pdf`
        );

    } catch (error) {

        console.error(
            "PDF generation error:",
            error
        );

        alert(
            "PDF download failed. Please try again."
        );
    }
}

// =========================================
// SKINGUARD AI - GEMINI CHATBOT
// =========================================

const chatbotButton = document.getElementById("chatbotButton");
const chatbot = document.getElementById("chatbot");
const closeChat = document.getElementById("closeChat");

const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");
const chatBody = document.querySelector(".chat-body");


// OPEN CHATBOT
chatbotButton.addEventListener("click", function () {
    chatbot.classList.add("active");
});


// CLOSE CHATBOT
closeChat.addEventListener("click", function () {
    chatbot.classList.remove("active");
});


// SEND MESSAGE
sendMessage.addEventListener("click", sendChatMessage);


// ENTER KEY
chatInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        sendChatMessage();
    }

});


// =========================================
// SEND MESSAGE TO FLASK BACKEND
// =========================================

async function sendChatMessage() {

    const message = chatInput.value.trim();

    if (message === "") {
        return;
    }


    // USER MESSAGE
    const userMessage = document.createElement("div");

    userMessage.className = "user-message";

    userMessage.textContent = message;

    chatBody.appendChild(userMessage);


    // CLEAR INPUT
    chatInput.value = "";


    // BOT LOADING MESSAGE
    const loadingMessage = document.createElement("div");

    loadingMessage.className = "bot-message";

    loadingMessage.textContent = "Typing...";

    chatBody.appendChild(loadingMessage);


    // SCROLL TO BOTTOM
    chatBody.scrollTop = chatBody.scrollHeight;


    try {

        const response = await fetch(
            "http://127.0.0.1:5000/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


        const data = await response.json();


        // REMOVE LOADING MESSAGE
        loadingMessage.remove();


        // BOT RESPONSE
        const botMessage = document.createElement("div");

        botMessage.className = "bot-message";

        botMessage.textContent =
            data.reply || "Sorry, I couldn't generate a response.";

        chatBody.appendChild(botMessage);


        // SCROLL TO BOTTOM
        chatBody.scrollTop = chatBody.scrollHeight;


    } catch (error) {

        console.error("Chat error:", error);

        loadingMessage.textContent =
            "Sorry, something went wrong. Please try again.";

    }

}