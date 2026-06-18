/* =========================================================
   GOOGLE AUTHENTICATION SYSTEM (BẢO MẬT MÃ HÓA KÉP)
   ========================================================= */

// Hàm giải mã chống Copy (XOR Cipher + Base64 + Reverse)
function decryptSOCData(encodedStr) {
    const SECRET_KEY = "SOC_FPT_2026"; // Chìa khóa bí mật để giải mã
    try {
        const reversed = encodedStr.split('').reverse().join('');
        const decodedB64 = decodeURIComponent(escape(atob(reversed)));
        let result = "";
        for(let i = 0; i < decodedB64.length; i++) {
            result += String.fromCharCode(decodedB64.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
        }
        return result;
    } catch(e) { return ""; }
}

class GoogleAuthManager {
    constructor() {
        this.user = this.loadUser();
        this.waitForGoogleAuth();
    }

    waitForGoogleAuth() {
        if (window.google && window.google.accounts) {
            this.initGoogleAuth();
        } else {
            setTimeout(() => this.waitForGoogleAuth(), 150);
        }
    }

    loadUser() {
        try {
            const saved = localStorage.getItem("soc_user");
            return saved ? JSON.parse(saved) : null;
        } catch (e) { return null; }
    }

    saveUser(user) {
        try { localStorage.setItem("soc_user", JSON.stringify(user)); } catch (e) {}
        this.user = user;
        window.dispatchEvent(new CustomEvent("soc_auth_ready", { detail: user }));
    }

    logout() {
        try { localStorage.removeItem("soc_user"); } catch (e) {}
        this.user = null;
        if (window.google && window.google.accounts) google.accounts.id.disableAutoSelect();
        
        if (typeof regionManager !== "undefined") {
            regionManager.clearSettings();
        }
    }

    initGoogleAuth() {
        try {
            google.accounts.id.initialize({
                client_id: "764929266866-62ua4ratuu6jimphrullociovmcdmkq9.apps.googleusercontent.com",
                callback: (response) => this.handleCredentialResponse(response),
                auto_select: false,
                cancel_on_tap_outside: false
            });

            const btn = document.getElementById("googleSignInBtn");
            if (btn) google.accounts.id.renderButton(btn, { theme: "outline", size: "large", width: "100%" });
            
            if (this.isLoggedIn()) {
                this.loadSecureConfigAndShow();
            } else {
                google.accounts.id.prompt(); 
            }
        } catch (error) { console.error("Lỗi khởi tạo Google Auth:", error); }
    }

    handleCredentialResponse(response) {
        try {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            const userData = JSON.parse(jsonPayload);
            
            const user = {
                name: userData.name,
                email: userData.email,
                picture: userData.picture,
                loginTime: new Date().toISOString(),
                provider: "google"
            };
            
            this.saveUser(user);
            this.loadSecureConfigAndShow();
            
        } catch (error) { 
            alert("Lỗi xác thực Google. Vui lòng thử lại!"); 
        }
    }

    loadSecureConfigAndShow() {
        fetch('config.json')
            .then(res => res.json())
            .then(data => {
                if(typeof regionManager !== "undefined") {
                    // Áp dụng hàm giải mã mạnh thay vì atob thông thường
                    regionManager.settings.southEmail = decryptSOCData(data.southEmail);
                    regionManager.settings.northEmail = decryptSOCData(data.northEmail);
                    regionManager.settings.defaultBccEmail = decryptSOCData(data.defaultBccEmail);
                }
                this.showMainInterface();
            })
            .catch(err => {
                console.error("Lỗi nạp file cấu hình:", err);
                alert("Không thể tải cấu hình bảo mật. Vui lòng kiểm tra lại đường dẫn file config.json.");
                this.logout();
                this.showLoginModal();
            });
    }

    showMainInterface() {
        const loginModal = document.getElementById("loginModal");
        const mainInterface = document.getElementById("mainInterface");
        
        if (loginModal) { loginModal.style.setProperty('display', 'none', 'important'); loginModal.classList.add("hidden"); }
        if (mainInterface) { mainInterface.style.setProperty('display', 'flex', 'important'); mainInterface.classList.remove("hidden"); }
        
        this.updateUserDisplay();
        window.dispatchEvent(new CustomEvent("soc_auth_ready", { detail: this.user }));
    }

    showLoginModal() {
        const loginModal = document.getElementById("loginModal");
        const mainInterface = document.getElementById("mainInterface");
        
        if (loginModal) { loginModal.style.setProperty('display', 'flex', 'important'); loginModal.classList.remove("hidden"); }
        if (mainInterface) { mainInterface.style.setProperty('display', 'none', 'important'); mainInterface.classList.add("hidden"); }
    }

    updateUserDisplay() {
        if (!this.user) return;
        try {
            const headerTitle = document.getElementById("headerTitle");
            if (headerTitle) headerTitle.textContent = `${this.user.name} - Dynamic Email Generator`;

            const elementsToUpdateName = ["sidebarUserName", "userNameDisplay"];
            elementsToUpdateName.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = this.user.name;
            });

            const elementsToUpdateEmail = ["sidebarUserEmail", "userEmailDisplay"];
            elementsToUpdateEmail.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = this.user.email;
            });
        } catch (e) { console.error("Lỗi cập nhật hiển thị:", e); }
    }

    isLoggedIn() { return this.user !== null; }
}

const authManager = new GoogleAuthManager();

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#logoutBtn, #btnLogout").forEach(btn => {
        btn.addEventListener("click", () => {
            authManager.logout();
            authManager.showLoginModal();
        });
    });
});