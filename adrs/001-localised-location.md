# Localised Location

* [Context and Problem Statement][]
* [Considered Options][]
  * [CultureGr\CustomRelation][]
  * [Update relationship queries][]
* [Decision Outcome][]
* [Consequences][]

## Context and Problem Statement
[Context and Problem Statement]: #context-and-problem-statement

Because the names for [Locations][] vary per language, and because the application is localised,
it makes sense to fetch the localised version of a [Location][] when fetching an [Item][].

Each [Item][], however, is saved with a single [Location][] linked to it through an
[Eloquent relationship][], and that is in the language that the giver of said [Item][] used.

Another issue comes in about when to fetch the localised versions of each [Location][] from
[Google Places][]. Because there is a cost involved, fetching all languages for a [Location][]
the moment an [Item][] is created could be too costly. It also means that when a new language is
ever introduced it would cost too costly to backfill all existing [Locations][] for the new
language. Different languages for an existing [Location][] should rather only be fetched on
demand.

## Considered Options
[Considered Options]: #considered-options

### CultureGr\CustomRelation
[CultureGr\CustomRelation]: #culturegr-customrelation

The [culturegr/custom-relation][] package adds the ability to add custom relationships between
[Eloquent models][]. It defines functionality for either eager-loaded or lazy-loaded
[Eloquent models][]. It does offer a way to map related [Eloquent models][] to their respective
parent models, but pre-fetching the missing [Locations][] would still be incredibly complex.

### Update relationship queries
[Update relationship queries]: #update-reationship-queries

[Laravel][] does offer a way (although not really documented anywhere) to update the method for
fetching [Eloquent relationships][]. Because of the nature of eager loading, this does not offer a
way to access each parent [Item][] while fetching a [Location][], meaning that it does not work
while eager loading.

## Decision Outcome
[Decision Outcome]: #decision-outcome

It was decided that [Update relationship queries][] would be the most acceptible solution. Using
[CultureGr\CustomRelation][] would be too complex to maintain, and the
[culturegr/custom-relation][] package could be abandoned at any time.

## Consequences
[Consequences]: #consequences

Because eager-loading is not supported, it was decided that lazy-loading the [Locations][] would
be the only viable option for public-facing views. This does of course come at a penalty of quite
a few more queries. When fetching a list of [Items][] for a specific user, these could be
eager-loaded as the [Location][] would already be in the user's language.

---

[culturegr/custom-relation]: https://github.com/culturegr/custom-relation
[Eloquent models]: https://laravel.com/docs/11.x/eloquent
[Eloquent relationship]: https://laravel.com/docs/11.x/eloquent-relationships
[Eloquent relationships]: https://laravel.com/docs/11.x/eloquent-relationships
[Google Places]: https://developers.google.com/maps/documentation/places/web-service/overview
[Item]: /app/app/Models/Item.php
[Items]: /app/app/Models/Item.php
[Laravel]: https://laravel.com/
[Location]: /app/app/Models/Location.php
[Locations]: /app/app/Models/Location.php
