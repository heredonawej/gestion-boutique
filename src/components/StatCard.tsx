interface Props {
  titre: string;
  valeur: string | number;
  icone: string;
  couleur: string;
}

function StatCard({
  titre,
  valeur,
  icone,
  couleur,
}: Props) {
  return (
    <div
      className={`
        ${couleur}
        relative
        overflow-hidden
        rounded-2xl
        p-6
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      `}
    >

      {/* Cercle décoratif */}

      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />

      <div className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full bg-white/5" />


      {/* Contenu */}

      <div className="relative z-10">

        <div className="flex items-start justify-between">

          {/* Texte */}

          <div>

            <p className="text-sm font-medium text-white/80">
              {titre}
            </p>

            <h2 className="text-3xl font-bold mt-3 tracking-tight">
              {valeur}
            </h2>

          </div>


          {/* Icône */}

          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
            {icone}
          </div>

        </div>


        {/* Ligne décorative */}

        <div className="mt-6 h-1 w-12 rounded-full bg-white/40" />

      </div>

    </div>
  );
}

export default StatCard;