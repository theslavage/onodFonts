import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LicensePage = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans p-6 md:p-12 pt-24 max-w-4xl mx-auto">
      <Link to="/about" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-red-500 mb-12">
        <ArrowLeft className="w-4 h-4" /> Назад к Манифесту
      </Link>

      <h1 className="text-4xl md:text-6xl font-bold mb-12 uppercase tracking-tighter">Лицензия</h1>

      <div className="space-y-8 font-serif text-lg leading-relaxed text-neutral-800">
        <section>
          <h2 className="font-sans text-xl font-bold uppercase tracking-wide mb-4">Open Source Philosophy</h2>
          <p>
            ONOD Fonts — это агрегатор открытого программного обеспечения. Мы верим в свободный веб. Все шрифты, размещенные в нашем каталоге, распространяются под свободными лицензиями.
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xl font-bold uppercase tracking-wide mb-4">Типы Лицензий</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <strong>SIL Open Font License (OFL):</strong> Разрешает использование, модификацию и распространение, но запрещает продажу самого файла шрифта.
            </li>
            <li>
              <strong>Apache License 2.0:</strong> Позволяет использование в коммерческих целях, модификацию и распространение.
            </li>
            <li>
              <strong>MIT License:</strong> Максимально пермиссивная лицензия. Делайте что хотите, но сохраняйте копирайт.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-sans text-xl font-bold uppercase tracking-wide mb-4">Правообладатели</h2>
          <p>
            Все права на шрифты принадлежат их авторам. Имена авторов и ссылки на оригинальные источники указаны в карточке каждого шрифта. ONOD Fonts не присваивает авторство представленных работ.
          </p>
        </section>

        <div className="pt-12 border-t border-black mt-12">
            <p className="font-mono text-xs uppercase text-neutral-500">
                ONOD Fonts / I’MON Digital
            </p>
        </div>
      </div>
    </div>
  );
};
