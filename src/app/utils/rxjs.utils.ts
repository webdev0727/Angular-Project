import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { timer } from 'rxjs/observable/timer';
import { mergeMap, finalize } from 'rxjs/operators';

export const genericRetryStrategy = (
  {
    maxRetryAttempts = 10,
    scalingDuration = 5000,
    excludedStatusCodes = []
  }: {
    maxRetryAttempts?: number;
    scalingDuration?: number;
    excludedStatusCodes?: number[];
  } = {}
) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((result, i) => {
      const retryAttempt = i + 1;
      let rate = (result && result['length']) ? result[result['length']-1].result['obj'] : null;
      if (rate) {
        //error will be picked up by retryWhen
        return rate;
      } else if (!rate && retryAttempt > maxRetryAttempts) {
        return _throw(result);
      }
      // retry after 1s, 2s, etc...
      return timer(scalingDuration);
    }),
    finalize(() => console.log('We are done!'))
  );
};
