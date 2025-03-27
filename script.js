import {Revenant} from "./toRevenant.js";
import {HighRevenant} from "./toHighRevenant.js";
import {MagiReplica} from "./toMagiReplica.js";

document.addEventListener("DOMContentLoaded", () => {
    /**
     * @TODO
     * [x] いずれは宣言特技とかの抽出もしたい
     * [x] getFieldをclassタグつけて管理する方向へ
     * [ ] チャット欄へのテンプレート挿入をexecCommandで実装
     * [ ] プレビュー表示したjsonを取り込む形式を止める
     * [ ] 画面下部のプレビューを変更する 左側にモンスターとそのポップアップ　右側に情報として出てくるアレをそのまま置くイメージ
     * [ ] 多部位のモンスターをまとめて入力できるように改修する
    */
    
    const getField = () => {
        return [...document.getElementsByClassName("field")];
    }

    const output = document.getElementById("output");
    const result = output.querySelector("span");
    const makeCharactor = () => {
        const field = getField();
        const data = new Map();
        const format = text => text.replaceAll(`"`, `\"`)
                                   .replaceAll("\n", "\\n")    
                                   .replaceAll("*", "×")
                                   .replaceAll("◯", "○") // ほんとにちょっとだけ違う(置き換え前の方がデカい)
                                   .replaceAll(/[０-９]/g, m=>'０１２３４５６７８９'.indexOf(m))
                                   .replaceAll(/d[＋ー][0-9]+/g, m=>"d" + (m[1] == "＋" ? "+" : "-") + m.slice(2));
        
        field.map(e => {
            const key = e.placeholder;
            const value = format(e.value);
            data.set(key, value);
            if(["生命抵抗力", "精神抵抗力", "命中力", "回避力"].includes(key)) {
                data.set(`${key}-固定`, Number(value)+7);
            }
        });

        // 画面下部に表示する都合上バックスラッシュが2個になってややこしいので調整したいところ
        // データ側で管理したものを調整して画面上に表示する手法に変更した方がいいかも
        const fillNullProp = (key, fillValue = "ー") => {
            const value = data.get(key);
            const nCount = (value.match(/\\n/g) || []).length; // 改行のみも空白として扱う
            if(value == "" || 2*nCount == value.length) 
                data.set(key, fillValue);
            };
        fillNullProp("移動速度-地");
        fillNullProp("移動速度-他");
        fillNullProp("攻撃方法", "なし");
        fillNullProp("命中力");
        fillNullProp("打撃点");
        fillNullProp("部位数");
        fillNullProp("部位詳細");
        fillNullProp("部位名");
        fillNullProp("コア部位");
        fillNullProp("特殊能力", "なし");
        fillNullProp("解説", "なし");
        fillNullProp("戦利品", "なし");
        data.set("戦利品", data.get("戦利品").replace(/[0-9]{4}G/g, m=>{return `${m[0]},${m.slice(1)}`}));
        ["特殊能力", "解説", "戦利品"].forEach(key => {
            const value = data.get(key);
            if(value.slice(-2) != "\\n") data.set(key, value + "\\n"); 
        })


        let name = data.get("名称");
        if(data.get("部位数") != "ー") {
            const core = data.get("コア部位").replaceAll(" ", "").split(",");
            name += `[${data.get("部位名")}${core.includes(data.get("部位名")) ? "*" : ""}]`;
        }

        let params = "";
        for(let key of data.keys()) {
            params += `{"label": "${key}","value": "${data.get(key)}"},`;
        }
        params = params.slice(0,-1); // 末尾の","を消してる

        let memo = "";
        let commands = "";
        const toDiceFormat = (key) => `2d${data.get(key) == 0 ? "" : (data.get(key) > 0 ? "+" : "") + data.get(key)}`;
        memo += `攻撃方法:${data.get("攻撃方法")}`
        if(data.get("攻撃方法") != "なし") {
            memo += `　命中力:${data.get("命中力")}(${data.get("命中力-固定")})`;
            memo += `　打撃点:${data.get("打撃点")}`
            commands += `${toDiceFormat("命中力")} 【命中力判定】\\n`;
            commands += `${data.get("打撃点")} 【ダメージ】\\n`;
        }
        commands += `${toDiceFormat("回避力")} 【回避力判定】\\n`;
        commands += `${toDiceFormat("生命抵抗力")} 【生命抵抗力判定】\\n`;
        commands += `${toDiceFormat("精神抵抗力")} 【精神抵抗力判定】`;                
        /**
         * 覚書
         * cocoforiaのキャラクター編集欄下部オプション
         *  "secret": false,
         *  "invisible": false,
         *  "hideStatus": false
         *  */
        return `{
                    "kind": "character",
                    "data": {
                        "name": "${name}",
                        "initiative": ${data.get("回避力-固定")},
                        "externalUrl": "",
                        "iconUrl": "",
                        "memo": "${data.get("特殊能力")}ーーーーーーーーーーーーーーーーーー\\n${memo}",
                        "commands": "${commands}",
                        "status": [
                            {"label": "HP","value": "${data.get("HP")}","max": "${data.get("HP")}"},
                            {"label": "MP","value": "${data.get("MP")}","max": "${data.get("MP")}"},
                            {"label": "防護点","value": "${data.get("防護点")}"}
                        ],
                        "params": [
                            ${params}
                        ]
                    }
                }`;
    }
    // ==================================================
    // 以下入出力周り
    // ==================================================
    let toggle = true;
    output.addEventListener("mouseenter", () => {
        toggle = false;
        }, true,);
    output.addEventListener("mouseleave", () => {
        toggle = true;
        toJSON();
    }, true,);
    
    const toJSON = () => {
        result.innerHTML = makeCharactor();

        if(toggle) window.requestAnimationFrame(toJSON);
    }
    toJSON();
    const getParams = (json) => {
        const parse_data = JSON.parse(json);
        const result = new Map();
        for(let data of parse_data.data.params) result.set(data.label, data.value);
        return result;
    }
    const refrectParams = (params) => {
        const fields = getField();
        for(let field of fields) {
            if(params.has(field.placeholder)) {
                field.value = params.get(field.placeholder);
            }
        }
    }
    document.addEventListener("paste", e => {
        // event.preventDefault();

        const paste = (event.clipboardData || window.clipboardData).getData("text");
        console.log(paste);

        const params = getParams(paste);
        console.log(params);
        refrectParams(params);
    });
    const format = (text) => {
        return JSON.stringify(JSON.parse(text), null, "\t");
    }
    document.getElementById("dl").addEventListener("click", e => {
        const params = getParams(makeCharactor());
        e.target.download = `${params.get("レベル")}-${params.get("名称")}${params.get("部位名") == "ー" ? "" : `-${params.get("部位名")}`}.json`;
        e.target.href = URL.createObjectURL(new Blob([format(makeCharactor())], {type: "text/plain"}))
    })
    /**
     *  @TODO 全体的に継ぎ足してる部分が増えてきてるからリファクタリングしたい
     */
    // ========================================
    // 追加要素たち
    // ========================================

    // ========================================
    // 1. コンバートボタン
    // ========================================
    const applyMap = (map, key, f) => map.set(key, f(map.get(key)));
    const convertTo = (type) => {
        const json = makeCharactor();
        const params = getParams(json);
        for(let key of params.keys()) {
            if(type.has(key)) {
                applyMap(params, key, type.get(key));
            }
        }
        refrectParams(params);
        console.log(type);
    }
    document.getElementById("toRevenant")    .addEventListener("click", () => convertTo(Revenant));
    document.getElementById("toHighRevenant").addEventListener("click", () => convertTo(HighRevenant));
    document.getElementById("toMagiReplica") .addEventListener("click", () => convertTo(MagiReplica));

    // ========================================
    // 2. スキル個別抽出関数
    // コンバート処理の一部分に組み込まれてる
    // ========================================
    const preview = document.getElementById("skill_preview");
    const pickupSkill = (text) => text.match(/([▶︎▷●○]|\((?=宣\)))([^(▶︎▷●○]|\((?!宣\))|(?<!\n)[(▶︎▷●○])*/g);
    document.addEventListener("keydown", e => {
        if(e.key == "Escape") {
            preview.innerHTML = "";
            const skills = pickupSkill(document.querySelector("textarea").value);
            skills.forEach(e => {
                if(e[0] == "●") {
                    const id = e.match(/(?=●).*/)[0];
                    const parts = `<div><input id="${id}" type="checkbox"><label for="${id}" style="user-select: none;">${id}</label></div>`
                    preview.innerHTML += parts;
                }
            })
        }
    })
    // const parsingSkill = (arr) => 
})