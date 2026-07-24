---
slug: evidence-map
title: Kanıt Haritası
description:
  Araştırma iddialarını kanıt türleriyle eşleştiren geliştirme amaçlı kısa bir
  beyaz kitap.
type: whitepaper
status: published
epistemicStatus: established
publishedAt: 2026-07-01
updatedAt: 2026-07-01
version: 1.0.0
language: tr
tags:
  - arastirma-yontemleri
  - kanit
relatedWritings:
  - revision-as-method
  - seed-theory-draft
references:
  - id: astro-content
    title: Astro Content Collections API Reference
    container: Astro Docs
    url: https://docs.astro.build/en/reference/modules/astro-content/
    accessedAt: 2026-07-24
  - id: example-doi
    title: Development fixture DOI record
    publisher: GeneSite fixture
    doi: 10.1000/182
    note: Phase 2 DOI bağlantısı görünümünü sınamak için kullanılan örnek kayıt.
featured: true
draft: false
revisionNotes: []
---

> Geliştirme fixture'ı: Bu metin yalnızca Phase 1 içerik sözleşmesini sınamak
> için hazırlanmıştır.

## Önerme

Kanıt türlerinin açıkça adlandırılması, bir iddianın sınırlarının okunmasını
kolaylaştırır. Bu fixture,
[Astro içerik katmanı belgelerine](https://docs.astro.build/en/reference/modules/astro-content/)
giden görünür bir bağlantı da içerir.

### İnceleme sırası

1. İddiayı tek cümlede sınırla.
2. Dayanakları türlerine göre ayır:
   - doğrudan gözlem;
   - ikincil sentez;
   - yorum.
3. Eksik kanıtı sonuçtan ayrı kaydet.

> Kanıt yokluğu ile karşı kanıt aynı şey değildir. Bu ayrım, metnin epistemik
> durumuyla birlikte okunmalıdır.

## Örnek sınıflandırma

<div
  class="table-scroll-region"
  role="region"
  aria-labelledby="evidence-classes-caption"
  tabindex="0"
>
  <table>
    <caption id="evidence-classes-caption">
      Geliştirme fixture'ında kullanılan örnek kanıt sınıfları
    </caption>
    <thead>
      <tr>
        <th scope="col">Sınıf</th>
        <th scope="col">İşlev</th>
        <th scope="col">Sınır</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Gözlem</th>
        <td>Doğrudan kayıt</td>
        <td>Bağlam dışına taşınamaz</td>
      </tr>
      <tr>
        <th scope="row">Sentez</th>
        <td>Birden çok kaynağı birleştirir</td>
        <td>Seçim ölçütüne bağlıdır</td>
      </tr>
    </tbody>
  </table>
</div>

Basit bir içerik denetimi teknik olarak şöyle ifade edilebilir:

```ts
const isInspectable = references.length > 0 && !draft;
```

<figure>
  <blockquote>
    <p>Bir iddianın gücü, yalnızca kaynak sayısıyla ölçülemez.</p>
  </blockquote>
  <figcaption>
    Kavramsal fixture — kaynak bağlamı: GeneSite Phase 2 okuma denetimi.
  </figcaption>
</figure>

<dl>
  <dt><abbr title="Digital Object Identifier">DOI</abbr></dt>
  <dd>Kalıcı bir kaynak tanımlayıcısıdır.</dd>
  <dt>Sürüm</dt>
  <dd>Metindeki değişimin kayıtlı durumudur.</dd>
</dl>

Yöntemin kapsamı örneklem<sup>1</sup> ve ölçüm<sub>t</sub> sınırlarıyla birlikte
okunmalıdır.[^fixture]

[^fixture]: Bu dipnot yalnızca Phase 2 dipnot görünümünü sınar.
