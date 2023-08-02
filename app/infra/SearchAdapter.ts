import {
  AccessLevel,
  Inject,
  SingletonProto,
} from '@eggjs/tegg';
import { EggAppConfig } from 'egg';

import { Client as ElasticsearchClient, estypes } from '@elastic/elasticsearch';
import { SearchAdapter } from '../common/typing';

/**
 * Use elasticsearch to search the huge npm packages.
 */
@SingletonProto({
  accessLevel: AccessLevel.PUBLIC,
  name: 'searchAdapter',
})
export class ESSearchAdapter implements SearchAdapter {
  @Inject()
  private config: EggAppConfig;

  @Inject()
  private readonly elasticsearch: ElasticsearchClient; // 由 elasticsearch 插件引入

  async search<T>(query: any): Promise<estypes.SearchHitsMetadata<T>> {
    const { elasticsearch: { index } } = this.config;
    const result = await this.elasticsearch.search<T>({
      index,
      ...query,
    });
    return result.hits;
  }

  async upsert<T>(id: string, document: T): Promise<string> {
    const { elasticsearch: { index } } = this.config;
    const res = await this.elasticsearch.index({
      id,
      index,
      body: document,
    });
    return res._id;
  }

  async delete(id: string): Promise<string> {
    const { elasticsearch: { index } } = this.config;
    const res = await this.elasticsearch.delete({
      index,
      id,
    });
    return res._id;
  }
}