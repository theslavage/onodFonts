import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans p-6 md:p-12 pt-24 max-w-4xl mx-auto">
      <Link to="/about" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-red-500 mb-12">
        <ArrowLeft className="w-4 h-4" /> Назад к Манифесту
      </Link>

      <h1 className="text-4xl md:text-6xl font-bold mb-12 uppercase tracking-tighter">Пользовательское соглашение</h1>

      <div className="space-y-8 font-serif text-lg leading-relaxed text-neutral-800">
        <section>
          <h2 className="font-sans text-xl font-bold uppercase tracking-wide mb-4">1. Предмет соглашения</h2>
          <p>
            Настоящее Соглашение регулирует отношения между Администрацией сайта ONOD Fonts (далее — Администрация) и Пользователем данного Сайта.
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xl font-bold uppercase tracking-wide mb-4">2. Статус контента</h2>
          <p>
            2.1. Весь контент, представленный на сайте (шрифты, изображения, тексты), предоставляется по принципу "как есть" (as is).
          </p>
          <p>
            2.2. Шрифты, представленные в каталоге, распространяются на условиях открытых лицензий (OFL, Apache 2.0, MIT). Пользователь обязан самостоятельно проверять лицензию конкретного шрифта перед его использованием в коммерческих проектах.
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xl font-bold uppercase tracking-wide mb-4">3. Ограничение ответственности</h2>
          <p>
            3.1. Администрация не несет ответственности за любые прямые или косвенные убытки, возникшие в результате использования Сайта или размещенного на нем контента.
          </p>
          <p>
            3.2. Администрация не гарантирует бесперебойную работу Сайта, хотя и стремится к этому (см. SLA 99.9% в Манифесте).
          </p>
        </section>

        <div className="pt-12 border-t border-black mt-12">
            <p className="font-mono text-xs uppercase text-neutral-500">
                Редакция от 29 Ноября 2025<br/>
                I’MON Digital Agency
            </p>
        </div>
      </div>
    </div>
  );
};
