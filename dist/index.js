"use strict";
// Enum для типів героїв
var HeroType;
(function (HeroType) {
    HeroType["Warrior"] = "WARRIOR";
    HeroType["Mage"] = "MAGE";
    HeroType["Archer"] = "ARCHER";
})(HeroType || (HeroType = {}));
// Enum для типів атак
var AttackType;
(function (AttackType) {
    AttackType["Physical"] = "PHYSICAL";
    AttackType["Magical"] = "MAGICAL";
    AttackType["Ranged"] = "RANGED";
})(AttackType || (AttackType = {}));
// Лічильник для унікальних ID героїв
let heroIdCounter = 1;
// Функція створення нового героя
function createHero(name, type) {
    let stats;
    switch (type) {
        case HeroType.Warrior:
            stats = { health: 100, attack: 15, defense: 10, speed: 5 };
            break;
        case HeroType.Mage:
            stats = { health: 70, attack: 20, defense: 5, speed: 7 };
            break;
        case HeroType.Archer:
            stats = { health: 80, attack: 18, defense: 7, speed: 10 };
            break;
        default:
            throw new Error("Unknown hero type");
    }
    return {
        id: heroIdCounter++,
        name,
        type,
        attackType: type === HeroType.Mage ? AttackType.Magical : type === HeroType.Archer ? AttackType.Ranged : AttackType.Physical,
        stats,
        isAlive: true
    };
}
// Функція розрахунку пошкодження
function calculateDamage(attacker, defender) {
    const baseDamage = attacker.stats.attack - defender.stats.defense;
    const isCritical = Math.random() < 0.2; // 20% шанс критичного удару
    const damage = Math.max(baseDamage * (isCritical ? 2 : 1), 0);
    defender.stats.health -= damage;
    if (defender.stats.health <= 0) {
        defender.isAlive = false;
        defender.stats.health = 0;
    }
    return {
        damage,
        isCritical,
        remainingHealth: defender.stats.health
    };
}
// Функція проведення раунду бою між героями
function battleRound(hero1, hero2) {
    if (!hero1.isAlive || !hero2.isAlive) {
        return "Один із героїв вже мертвий і не може брати участь у бою.";
    }
    const attacker = hero1.stats.speed >= hero2.stats.speed ? hero1 : hero2;
    const defender = attacker === hero1 ? hero2 : hero1;
    const result = calculateDamage(attacker, defender);
    return `Герой <b>${attacker.name}</b> атакує <b>${defender.name}</b> і завдає <b>${result.damage}</b> ${result.isCritical ? "(КРИТИЧНИЙ УДАР)" : ""} шкоди. У <b>${defender.name}</b> залишилось <b>${result.remainingHealth}</b> здоров'я.`;
}
// Ініціалізація героїв
const heroes = [
    createHero("М1шка", HeroType.Warrior),
    createHero("СерЬожка", HeroType.Mage),
    createHero("Артурка", HeroType.Archer)
];
// DOM елемент для виведення результатів
const output = document.getElementById("output");
// Функція логування в HTML
function log(message) {
    if (output) {
        output.innerHTML += `<p>${message}</p>`;
    }
}
// Запуск битви
function startBattle() {
    output.innerHTML = ""; // Очищення попередніх результатів
    log("<h3>=== Створені герої ===</h3>");
    heroes.forEach(hero => log(`${hero.name} - ${hero.type} (Здоров'я: ${hero.stats.health})`));
    log("<h3>=== Бій між героями ===</h3>");
    const battleResult = battleRound(heroes[0], heroes[1]);
    log(battleResult);
    log("<h3>=== Статус героїв після бою ===</h3>");
    heroes.forEach(hero => {
        log(`${hero.name}: ${hero.isAlive ? "Живий" : "Мертвий"}, Здоров'я: ${hero.stats.health}`);
    });
}
// Додаємо функцію в глобальну область видимості
window.startBattle = startBattle;
