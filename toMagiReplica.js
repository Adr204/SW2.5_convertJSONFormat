export const MagiReplica = new Map();
MagiReplica.set("名称", v => `マギレプリカ(${v})`);
MagiReplica.set("種族", v => `魔導機`);
MagiReplica.set("レベル", v => `${Number(v)+1}`);
MagiReplica.set("知能", v => `命令を聞く`);
MagiReplica.set("知覚", v => `機械`);
MagiReplica.set("反応", v => `命令による`);
MagiReplica.set("言語", v => `魔導機文明語`);
MagiReplica.set("生息地", v => `遺跡`);
MagiReplica.set("弱点", v => `雷属性ダメージ+3`);
MagiReplica.set("コア部位", v => `なし`);
MagiReplica.set("命中力", v => `${Number(v)+1}`);
MagiReplica.set("打撃点", v => `2d+${Number(v.slice(2))+2}`.replace("+-", "-").replace("+0", ""));
MagiReplica.set("防護点", v => `${Number(v)+1}`);
MagiReplica.set("HP", v => `${Number(v)+5}`);
MagiReplica.set("MP", v => `0`);
MagiReplica.set("特殊能力", v => {
    const uniqueSkill = "◯機械の身体\n刃武器から、クリティカルを受けません。\n";
    if(v.startsWith("なし")) return uniqueSkill;
    return v.replaceAll(/[▶︎▷◯●(][^▶︎▷◯●(]*回復[^▶︎▷◯●(]*/g, "")
            .replaceAll(/◯機械の身体[^▶︎▷◯●(]*/g, "")
            .replace(/●全身\n|/, m=>m+uniqueSkill);
});
MagiReplica.set("解説", v => `マギレプリカは、動物をモデルにして魔導機として再現したものです。\n明らかに金属製であることを除けば、外観はモデルとした動物にそっくりであり、極めてよく似た動作を行います。`);
MagiReplica.set("戦利品", v => `自動:鉄(20G/黒B)\n2~5:粗悪な魔導部品(100G/黒白A)\n6~9:魔導部品(300G/黒白A)\n10~:稀少な魔導部品(900G/黒白A)`);