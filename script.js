const cours = document.querySelectorAll("div > p");

let cours_choisi;
let prealable_direct = [];
let prealable_indirect = [];
let co_requis = [];
let suite_direct = [];
let suite_indirect = [];

function getPrerequisites(course) {
  const prerequisites = [];

  for (const classe of course.classList) {
    if (classe === "pa-all1") {
      prerequisites.push(
        ...document.querySelectorAll(
          "#session1 > p, #session2 > p, #session3 > p, #session4 > p"
        )
      );
    } else if (classe === "pa-all2") {
      prerequisites.push(
        ...document.querySelectorAll(
          "#session5 > p"
        )
      );
    } else if (classe.startsWith("pa-")) {
      const prerequisite = document.getElementById(classe.slice(3));
      if (prerequisite) prerequisites.push(prerequisite);
    }
  }

  return prerequisites;
}

function show_prealable(course) {
  cours_choisi = typeof course === "string"
    ? document.getElementById(course)
    : course;

  if (!cours_choisi) return;

  prealable_direct = [];
  prealable_indirect = [];
  co_requis = [];

  const directCourses = getPrerequisites(cours_choisi);
  prealable_direct = [...new Set(directCourses.map((c) => c.id))];

  for (const classe of cours_choisi.classList) {
    if (classe.startsWith("cr-")) {
      co_requis.push(classe.slice(3));
    }
  }

  const visited = new Set();

  function collectIndirect(course) {
    if (!course || visited.has(course.id)) return;
    visited.add(course.id);

    for (const prerequisite of getPrerequisites(course)) {
      if (!prealable_direct.includes(prerequisite.id)) {
        prealable_indirect.push(prerequisite.id);
      }
      collectIndirect(prerequisite);
    }
  }

  for (const prerequisite of directCourses) {
    collectIndirect(prerequisite);
  }

  prealable_indirect = [...new Set(prealable_indirect)].filter(
    (id) => !prealable_direct.includes(id)
  );

  montrerCompetences()
  classFormat();
}

cours.forEach((course) => {
  course.addEventListener("click", () => show_prealable(course));
});

function classFormat() {
  for (const course of cours) {
    course.classList.remove("pa-direct", "pa-indirect", "cr", "choisi");

    if (course === cours_choisi) {
      course.classList.add("choisi");
    } else if (prealable_direct.includes(course.id)) {
      course.classList.add("pa-direct");
    } else if (prealable_indirect.includes(course.id)) {
      course.classList.add("pa-indirect");
    } else if (co_requis.includes(course.id)) {
      course.classList.add("cr");
    }
  }
}

function montrerCompetences() {
  const objectifs = document.querySelectorAll(".cours_present > div");
  const sous_objectifs = document.querySelectorAll(".cours_present > div > ul > li")

  objectifs.forEach(objectif => {
    objectif.classList.add("hidden");

    if (objectif.classList.contains(cours_choisi.id)) {
      objectif.classList.remove("hidden");
    }
  })

  sous_objectifs.forEach(objectif => {
    objectif.classList.add("hidden");

    if (objectif.classList && objectif.classList.contains(cours_choisi.id)) {
      objectif.classList.remove("hidden");
    }
  })

  if (co_requis) {
    const objectifs_cr = document.querySelectorAll(".cours_corequis > div");
    const sous_objectifs_cr = document.querySelectorAll(".cours_corequis > div > ul > li")

    objectifs_cr.forEach(objectif => {
      objectif.classList.add("hidden");

      for (courscr of co_requis) {
        if (objectif.classList.contains(courscr)) {
          objectif.classList.remove("hidden");
          break;
        }
      }
    })

    sous_objectifs_cr.forEach(objectif => {
      objectif.classList.add("hidden");

      for (const courscr of co_requis) {
        if (objectif.classList && objectif.classList.contains(courscr)) {
          objectif.classList.remove("hidden");
          break;
        }
      }
    })
  }

  if (prealable_direct) {
    const objectifs_pa = document.querySelectorAll(".cours_prealable > div");
    const sous_objectifs_pa = document.querySelectorAll(".cours_prealable > div > ul > li")

    objectifs_pa.forEach(objectif => {
      objectif.classList.add("hidden");

      for (prealable of (prealable_direct.concat(prealable_indirect))) {
        if (objectif.classList.contains(prealable)) {
          objectif.classList.remove("hidden");
          break;
        }
      }
    })

    sous_objectifs_pa.forEach(objectif => {
      objectif.classList.add("hidden");

      for (const prealable of prealable_direct.concat(prealable_indirect)) {
        if (objectif.classList && objectif.classList.contains(prealable)) {
          objectif.classList.remove("hidden");
          break;
        }
      }
    })
  }
}