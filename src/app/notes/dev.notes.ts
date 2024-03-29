/*
  At some point I might need 'source' property,
    like where did buff come from, or from which item did spell come.

  I was thinking to add some kind of 'source' prop to
    objects, but maybe I can store some relations
    outside, like some global map or something.
*/

/*
  In theory, if I want something like
  @WireProp(SomeEvent)
  public prop = event => {};

  It can become something like
  @WireProp()
  public doOnEvent = onEvent(SomeEvent, (event) => {});

  this might even work with `this`

  onEvent might return some technical type, but can extract
    event type from SomeEvent, with no need to specify specific type
    (allow type to sink down)

  then.. such functions might do something else... maybe pipes
    could be possible in some ways, maybe pipes
*/

/*
    It is better to have related models extracted and coupled
        together. Sometimes it may lead to circular dependencies.
        It can be fought explicitly, using `import type {...} from '...';`
        this will only import information about type, not introducing
        any dependencies by code. Although, it looks like typescript
        can manage these things on it's own implicitly.
*/
