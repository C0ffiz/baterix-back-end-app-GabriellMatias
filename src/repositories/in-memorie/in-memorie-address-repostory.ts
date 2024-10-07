import { Prisma, Address } from '@prisma/client'
import { AddressRepositoryProps } from '../interfaces/address-repository'

export class InMemoryAddressRepository implements AddressRepositoryProps {
  public items: Address[] = [] // Armazena os endereços em memória

  /**
   * Cria um novo endereço na memória.
   * @param data - Dados necessários para criar o endereço.
   * @returns O endereço criado.
   */
  async create(data: Prisma.AddressCreateInput): Promise<Address> {
    try {
      const address: Address = {
        id: `address${this.items.length + 1}`, // Gera um ID único baseado no número de endereços
        ...data,
        created_at: new Date(), // Adiciona a data de criação
      }

      this.items.push(address)
      return address
    } catch (error) {
      console.error('Error creating address in memory:', error)
      throw new Error('Failed to create address in memory.')
    }
  }

  /**
   * Encontra um endereço pelo seu ID.
   * @param addressId - ID do endereço a ser encontrado.
   * @returns O endereço encontrado ou null se não existir.
   */
  async findById(addressId: string): Promise<Address | null> {
    try {
      const address = this.items.find((item) => item.id === addressId)

      if (!address) {
        return null
      }
      return address
    } catch (error) {
      console.error('Error finding address by ID in memory:', error)
      throw new Error('Failed to find address by ID in memory.')
    }
  }

  /**
   * Encontra todos os endereços associados a um usuário específico.
   * @param userId - ID do usuário.
   * @returns Uma lista de endereços ou null se nenhum for encontrado.
   */
  async findByUserId(userId: string): Promise<Address[] | null> {
    try {
      const addresses = this.items.filter((item) => item.userId === userId) // Supondo que o Address tem uma propriedade userId

      return addresses.length > 0 ? addresses : null
    } catch (error) {
      console.error('Error finding addresses by user ID in memory:', error)
      throw new Error('Failed to find addresses by user ID in memory.')
    }
  }

  /**
   * Atualiza um endereço existente.
   * @param data - Dados para atualizar o endereço, incluindo o ID.
   * @returns O endereço atualizado.
   */
  async edit(
    data: Prisma.AddressUpdateInput & { id: string },
  ): Promise<Address> {
    try {
      const index = this.items.findIndex((item) => item.id === data.id)

      if (index === -1) {
        throw new Error('Address not found.')
      }

      const updatedAddress = { ...this.items[index], ...data }
      this.items[index] = updatedAddress // Atualiza o endereço na memória

      return updatedAddress
    } catch (error) {
      console.error('Error updating address in memory:', error)
      throw new Error('Failed to update address in memory.')
    }
  }

  /**
   * Exclui um endereço pelo seu ID.
   * @param addressId - ID do endereço a ser excluído.
   * @returns O endereço excluído.
   */
  async delete(addressId: string): Promise<Address> {
    try {
      const index = this.items.findIndex((item) => item.id === addressId)

      if (index === -1) {
        throw new Error('Address not found.')
      }

      const deletedAddress = this.items[index]
      this.items.splice(index, 1) // Remove o endereço da memória
      return deletedAddress
    } catch (error) {
      console.error('Error deleting address in memory:', error)
      throw new Error('Failed to delete address in memory.')
    }
  }
}
