import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { getChartData } from "../services/chartService";

interface ChartData {
  categorie: string;
  total: number;
}

function CategoryChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [chargement, setChargement] = useState(true);

  const chargerDonnees = async () => {
    try {
      const resultat = await getChartData();
      setData(resultat);
    } catch (error) {
      console.error(
        "Erreur chargement statistiques :",
        error
      );
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  // Total général des produits
  const totalProduits = data.reduce(
    (total, element) => total + Number(element.total),
    0
  );

  // Catégorie la plus importante
  const categoriePrincipale =
    data.length > 0
      ? data.reduce((max, element) =>
          Number(element.total) > Number(max.total)
            ? element
            : max
        )
      : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">

      {/* ============================
          EN-TÊTE
      ============================ */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
              📊
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Produits par catégorie
              </h2>

              <p className="text-sm text-gray-500">
                Répartition des produits dans votre boutique
              </p>
            </div>

          </div>
        </div>

        {/* Total produits */}

        <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 text-right">

          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Total produits
          </p>

          <p className="text-2xl font-bold text-gray-800">
            {totalProduits}
          </p>

        </div>

      </div>


      {/* ============================
          STATISTIQUES RAPIDES
      ============================ */}

      {!chargement && data.length > 0 && (

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">

            <p className="text-sm text-blue-600 font-medium">
              Catégories
            </p>

            <p className="text-2xl font-bold text-blue-800 mt-1">
              {data.length}
            </p>

          </div>


          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">

            <p className="text-sm text-indigo-600 font-medium">
              Catégorie dominante
            </p>

            <p className="text-lg font-bold text-indigo-800 mt-1 truncate">
              {categoriePrincipale?.categorie || "-"}
            </p>

          </div>

        </div>

      )}


      {/* ============================
          CHARGEMENT
      ============================ */}

      {chargement && (

        <div className="h-[350px] flex items-center justify-center">

          <div className="text-center">

            <div className="text-4xl mb-3">
              📊
            </div>

            <p className="text-gray-500">
              Chargement des statistiques...
            </p>

          </div>

        </div>

      )}


      {/* ============================
          AUCUNE DONNÉE
      ============================ */}

      {!chargement && data.length === 0 && (

        <div className="h-[350px] flex items-center justify-center">

          <div className="text-center">

            <div className="text-5xl mb-4">
              📦
            </div>

            <h3 className="font-semibold text-gray-700">
              Aucune donnée disponible
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Ajoutez des produits pour voir les statistiques.
            </p>

          </div>

        </div>

      )}


      {/* ============================
          GRAPHIQUE
      ============================ */}

      {!chargement && data.length > 0 && (

        <div className="w-full h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={data}
              margin={{
                top: 25,
                right: 20,
                left: 0,
                bottom: 10,
              }}
              barCategoryGap="25%"
            >

              <CartesianGrid
                vertical={false}
                stroke="#E5E7EB"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="categorie"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 12,
                }}
                dy={10}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#9CA3AF",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(59,130,246,0.05)",
                }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.10)",
                  padding: "12px 16px",
                }}
                labelStyle={{
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  `${value} produit(s)`,
                  "Quantité",
                ]}
              />

              <Bar
                dataKey="total"
                name="Produits"
                radius={[10, 10, 4, 4]}
                barSize={45}
                label={{
                  position: "top",
                  fill: "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >

                {data.map((_, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index % 3 === 0
                        ? "#2563EB"
                        : index % 3 === 1
                        ? "#4F46E5"
                        : "#6366F1"
                    }
                  />

                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      )}

      {/* ============================
          PIED
      ============================ */}

      {!chargement && data.length > 0 && (

        <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            📦 {totalProduits} produit(s) au total
          </p>

          <p className="text-sm text-gray-400">
            Mise à jour automatique
          </p>

        </div>

      )}

    </div>
  );
}

export default CategoryChart;