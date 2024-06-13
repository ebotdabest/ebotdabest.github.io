export class LangR {
    static init(args) {
        this.path = args.rootPath;
        this.key = args.currentKey;
        this.customPath = args.bigPath;
        this.forceRename = args.forceRename;

        this.useAutoPath = false;
        if (this.customPath == null) {
            let currentUrl = window.location.href;
            let url = new URL(currentUrl);
            this.customPath = url.origin;
            this.useAutoPath = true;
        }

        if (this.forceRename == null) {
            this.forceRename = false;
        }

        this.loadLang()
        window.LangR = LangR
    }

    static updateLang(langData) {
        document.querySelectorAll("[langr-key]").forEach(el => {
            const langrKey = el.getAttribute("langr-key");

            if (!el.hasAttribute("data-original")) {
                el.dataset.original = el.innerHTML;
            }
            let originalContent = el.dataset.original;

            try {
                const translation = langData[langrKey];
                if (translation && translation.includes("<prec>")) {
                    el.innerText = translation.replace("<prec>", originalContent);
                } else if (translation) {
                    el.innerText = translation;
                } else if (this.forceRename) {
                    el.innerText = `Key ${langrKey} not found!`;
                }
            } catch (e) {
                console.error(`[LangR] ERROR: The key ${langrKey} does not exist!`);
                console.error(e);
            }
        });
    }

    static loadLang() {
        let fullPath = ""
        if (this.useAutoPath) {
            fullPath = this.customPath + '/' + this.path + '/' + this.key + '.json'
        }else {
            fullPath = this.customPath + '/' + this.key + '.json'
        }
        const xhr = new XMLHttpRequest();
        xhr.open("GET", fullPath, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    LangR.updateLang(JSON.parse(xhr.responseText))
                }catch(err) {
                    console.error("[LangR] ERROR: COULD NOT PARSE FILE AT: " + fullPath)
                }
            }
        };
        xhr.send();
    }

    static changeLang(newLang) {
        this.key = newLang
        this.loadLang()
    }
}
